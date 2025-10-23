<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\Evenement;
use App\Mail\NewMessageMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Models\Conversation;
use App\Events\NewMessage;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Récupérer tous les utilisateurs avec qui l'utilisateur connecté a échangé des messages
            $users = User::whereHas('messagesEnvoyes', function($query) {
                $query->where('id_destinataire', Auth::id());
            })->orWhereHas('messagesRecus', function($query) {
                $query->where('id_utilisateur', Auth::id());
            })->where('id', '!=', Auth::id())->get();

            // Pour chaque utilisateur, récupérer le dernier message
            $conversations = $users->map(function($user) {
                $lastMessage = Message::where(function($query) use ($user) {
                    $query->where('id_utilisateur', Auth::id())
                          ->where('id_destinataire', $user->id);
                })->orWhere(function($query) use ($user) {
                    $query->where('id_utilisateur', $user->id)
                          ->where('id_destinataire', Auth::id());
                })->latest()->first();

                return [
                    'id' => $user->id,
                    'other_user' => $user,
                    'last_message' => $lastMessage
                ];
            });

            return Inertia::render('Messages/Index', [
                'conversations' => $conversations,
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Messages/Index', [
                'conversations' => [],
                'auth' => [
                    'user' => Auth::user()
                ],
                'error' => 'Erreur lors du chargement des conversations'
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'contenu' => 'required|string|max:1000',
                'id_destinataire' => 'required|exists:users,id',
                'id_evenement' => 'nullable|exists:evenements,id_evenement'
            ]);

            Log::info('Création d\'un nouveau message', [
                'user_id' => auth()->id(),
                'destinataire_id' => $request->id_destinataire,
                'evenement_id' => $request->id_evenement
            ]);

            $message = Message::create([
                'contenu' => $request->contenu,
                'id_utilisateur' => auth()->id(),
                'id_destinataire' => $request->id_destinataire,
                'id_evenement' => $request->id_evenement,
                'date_envoi' => now(),
                'lu' => false
            ]);

            // Récupérer tous les messages de la conversation
            $query = Message::where(function ($query) use ($request) {
                $query->where('id_utilisateur', auth()->id())
                    ->where('id_destinataire', $request->id_destinataire);
            })->orWhere(function ($query) use ($request) {
                $query->where('id_utilisateur', $request->id_destinataire)
                    ->where('id_destinataire', auth()->id());
            });

            if ($request->has('id_evenement')) {
                $query->where('id_evenement', $request->id_evenement);
            }

            $messages = $query->orderBy('date_envoi', 'asc')->get();

            // Récupérer l'utilisateur avec qui on discute
            $otherUser = User::findOrFail($request->id_destinataire);
            
            // Récupérer l'événement si spécifié
            $evenement = null;
            if ($request->has('id_evenement')) {
                $evenement = Evenement::find($request->id_evenement);
            }

            return back()->with([
                'message' => $message,
                'messages' => $messages,
                'otherUser' => $otherUser,
                'evenement' => $evenement
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Erreur de validation lors de l\'envoi du message', [
                'errors' => $e->errors()
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi du message', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Une erreur est survenue lors de l\'envoi du message');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user, Request $request)
    {
        try {
            Log::info('Début de la méthode show', [
                'user_id' => $user->id,
                'auth_id' => auth()->id(),
                'evenement_id' => $request->evenement
            ]);

            // Vérifier si l'utilisateur existe
            if (!$user) {
                Log::error('Utilisateur non trouvé', ['user_id' => $user->id]);
                throw new \Exception('Utilisateur non trouvé');
            }

            // Vérifier si l'utilisateur actuel est autorisé à voir cette conversation
            if (auth()->id() !== $user->id) {
                Log::info('Vérification des messages entre utilisateurs', [
                    'current_user' => auth()->id(),
                    'target_user' => $user->id
                ]);
            }

            // Récupérer les messages
            $query = Message::where(function ($query) use ($user) {
                $query->where('id_utilisateur', auth()->id())
                    ->where('id_destinataire', $user->id);
            })->orWhere(function ($query) use ($user) {
                $query->where('id_utilisateur', $user->id)
                    ->where('id_destinataire', auth()->id());
            });

            // Si un événement est spécifié, filtrer par cet événement
            if ($request->has('evenement') && $request->evenement) {
                $evenement = Evenement::find($request->evenement);
                if ($evenement) {
                    $query->where('id_evenement', $request->evenement);
                }
            }

            $messages = $query->orderBy('date_envoi', 'asc')->get();

            Log::info('Messages récupérés', [
                'count' => $messages->count(),
                'evenement_id' => $request->evenement
            ]);

            // Marquer les messages comme lus
            try {
                $unreadCount = Message::where('id_utilisateur', $user->id)
                    ->where('id_destinataire', auth()->id())
                    ->where('lu', false)
                    ->count();

                if ($unreadCount > 0) {
                    Log::info('Marquage des messages comme lus', ['count' => $unreadCount]);
                    Message::where('id_utilisateur', $user->id)
                        ->where('id_destinataire', auth()->id())
                        ->where('lu', false)
                        ->update(['lu' => true]);
                }
            } catch (\Exception $e) {
                Log::warning('Erreur lors du marquage des messages comme lus: ' . $e->getMessage());
                // Ne pas bloquer l'affichage des messages si le marquage échoue
            }

            // Préparer les données pour la vue
            $data = [
                'messages' => $messages,
                'otherUser' => $user,
                'auth' => [
                    'user' => auth()->user()
                ]
            ];

            // Ajouter l'événement aux données si spécifié
            if ($request->has('evenement') && $request->evenement) {
                $evenement = Evenement::find($request->evenement);
                if ($evenement) {
                    $data['evenement'] = $evenement;
                }
            }

            return Inertia::render('Chat/EventChat', $data);

        } catch (\Exception $e) {
            Log::error('Erreur dans la méthode show: ' . $e->getMessage());
            return Inertia::render('Chat/EventChat', [
                'error' => 'Une erreur est survenue lors de l\'affichage des messages: ' . $e->getMessage(),
                'auth' => [
                    'user' => auth()->user()
                ]
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Message $message)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        //
    }

    public function conversations()
    {
        try {
            $user = Auth::user();
            
            // Récupérer les conversations en fonction du rôle
            if ($user->role === 'organisateur') {
                // Pour un organisateur, récupérer les conversations avec les participants
                $conversations = Message::where('id_utilisateur', $user->id)
                    ->orWhere('id_destinataire', $user->id)
                    ->orderBy('date_envoi', 'desc')
                    ->get()
                    ->groupBy(function($message) use ($user) {
                        return $message->id_utilisateur === $user->id 
                            ? $message->id_destinataire 
                            : $message->id_utilisateur;
                    })
                    ->map(function($messages, $otherUserId) {
                        $otherUser = User::find($otherUserId);
                        $lastMessage = $messages->first();
                        
                        return [
                            'id' => $otherUserId,
                            'other_user' => $otherUser,
                            'last_message' => $lastMessage,
                            'unread_count' => $messages->where('id_destinataire', Auth::id())
                                ->where('lu', false)
                                ->count()
                        ];
                    })
                    ->values();
            } else {
                // Pour un participant, récupérer les conversations avec les organisateurs
                $conversations = Message::where(function($query) use ($user) {
                    $query->where('id_utilisateur', $user->id)
                          ->orWhere('id_destinataire', $user->id);
                })
                ->whereHas('evenement', function($query) {
                    $query->whereNotNull('id');
                })
                ->orderBy('date_envoi', 'desc')
                ->get()
                ->groupBy(function($message) use ($user) {
                    return $message->id_utilisateur === $user->id 
                        ? $message->id_destinataire 
                        : $message->id_utilisateur;
                })
                ->map(function($messages, $otherUserId) {
                    $otherUser = User::find($otherUserId);
                    $lastMessage = $messages->first();
                    
                    return [
                        'id' => $otherUserId,
                        'other_user' => $otherUser,
                        'last_message' => $lastMessage,
                        'unread_count' => $messages->where('id_destinataire', Auth::id())
                            ->where('lu', false)
                            ->count()
                    ];
                })
                ->values();
            }

            return Inertia::render('Messages/Index', [
                'conversations' => $conversations,
                'auth' => [
                    'user' => $user
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur dans MessageController@conversations: ' . $e->getMessage());
            return Inertia::render('Messages/Index', [
                'conversations' => [],
                'auth' => [
                    'user' => Auth::user()
                ],
                'error' => 'Erreur lors du chargement des conversations'
            ]);
        }
    }

    public function getNavigationConversations()
    {
        try {
            $user = Auth::user();
            
            // Récupérer les 5 dernières conversations
            $conversations = Message::where('id_utilisateur', $user->id)
                ->orWhere('id_destinataire', $user->id)
                ->orderBy('date_envoi', 'desc')
                ->get()
                ->groupBy(function($message) use ($user) {
                    return $message->id_utilisateur === $user->id 
                        ? $message->id_destinataire 
                        : $message->id_utilisateur;
                })
                ->take(5)
                ->map(function($messages, $otherUserId) {
                    $otherUser = User::find($otherUserId);
                    $lastMessage = $messages->first();
                    
                    return [
                        'id' => $otherUserId,
                        'other_user' => $otherUser,
                        'last_message' => $lastMessage,
                        'unread_count' => $messages->where('id_destinataire', Auth::id())
                            ->where('lu', false)
                            ->count()
                    ];
                })
                ->values();

            return response()->json([
                'conversations' => $conversations
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur dans MessageController@getNavigationConversations: ' . $e->getMessage());
            return response()->json([
                'conversations' => [],
                'error' => 'Erreur lors du chargement des conversations'
            ], 500);
        }
    }

    public function startConversationWithOrganizer(Evenement $evenement)
    {
        try {
            Log::info('Début de la conversation avec l\'organisateur', [
                'evenement_id' => $evenement->id_evenement,
                'user_id' => auth()->id()
            ]);

            // Vérifier si l'utilisateur est déjà participant
            $isParticipant = $evenement->participants()
                ->where('id_utilisateur', auth()->id())
                ->exists();

            if (!$isParticipant) {
                Log::warning('Utilisateur non participant tentant d\'accéder au chat', [
                    'user_id' => auth()->id(),
                    'evenement_id' => $evenement->id_evenement
                ]);
                return back()->with('error', 'Vous devez être participant pour accéder au chat');
            }

            // Récupérer l'organisateur de l'événement
            $organisateur = User::find($evenement->id_organisateur);
            if (!$organisateur) {
                Log::error('Organisateur non trouvé', [
                    'evenement_id' => $evenement->id_evenement,
                    'organisateur_id' => $evenement->id_organisateur
                ]);
                return back()->with('error', 'Organisateur non trouvé');
            }

            // Vérifier si une conversation existe déjà
            $existingMessages = Message::where(function ($query) use ($evenement) {
                $query->where('id_utilisateur', auth()->id())
                    ->where('id_destinataire', $evenement->id_organisateur)
                    ->where('id_evenement', $evenement->id_evenement);
            })->orWhere(function ($query) use ($evenement) {
                $query->where('id_utilisateur', $evenement->id_organisateur)
                    ->where('id_destinataire', auth()->id())
                    ->where('id_evenement', $evenement->id_evenement);
            })->exists();

            // Si aucune conversation n'existe, créer un message par défaut
            if (!$existingMessages) {
                $defaultMessage = Message::create([
                    'contenu' => "Bonjour, je suis intéressé(e) par votre événement '{$evenement->titre}'. J'aimerais avoir plus d'informations.",
                    'id_utilisateur' => auth()->id(),
                    'id_destinataire' => $evenement->id_organisateur,
                    'id_evenement' => $evenement->id_evenement,
                    'date_envoi' => now(),
                    'lu' => false
                ]);

                Log::info('Message par défaut créé', [
                    'message_id' => $defaultMessage->id_message,
                    'evenement_id' => $evenement->id_evenement
                ]);
            }

            // Récupérer tous les messages de la conversation
            $messages = Message::where(function ($query) use ($evenement) {
                $query->where('id_utilisateur', auth()->id())
                    ->where('id_destinataire', $evenement->id_organisateur)
                    ->where('id_evenement', $evenement->id_evenement);
            })->orWhere(function ($query) use ($evenement) {
                $query->where('id_utilisateur', $evenement->id_organisateur)
                    ->where('id_destinataire', auth()->id())
                    ->where('id_evenement', $evenement->id_evenement);
            })->orderBy('date_envoi', 'asc')->get();

            Log::info('Redirection vers le chat', [
                'evenement_id' => $evenement->id_evenement,
                'organisateur_id' => $evenement->id_organisateur,
                'messages_count' => $messages->count()
            ]);

            return Inertia::render('Chat/EventChat', [
                'messages' => $messages,
                'otherUser' => $organisateur,
                'evenement' => $evenement,
                'auth' => [
                    'user' => auth()->user()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors du démarrage de la conversation', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Une erreur est survenue lors du démarrage de la conversation');
        }
    }

    public function getMessagesWithUser(User $user)
    {
        // Récupérer l'ID de l'événement depuis la requête
        $eventId = request()->query('evenement');

        // Vérifier si l'utilisateur a le droit de voir cette conversation
        $hasConversation = Message::where(function($query) use ($user) {
            $query->where('id_utilisateur', Auth::id())
                ->where('id_destinataire', $user->id)
                ->orWhere('id_utilisateur', $user->id)
                ->where('id_destinataire', Auth::id());
        })->exists();

        if (!$hasConversation) {
            return redirect()->route('conversations.index')
                ->with('error', 'Vous n\'avez pas accès à cette conversation.');
        }

        $messages = Message::with(['user', 'destinataire', 'evenement'])
            ->where(function($query) use ($user) {
                $query->where(function($q) use ($user) {
                    $q->where('id_utilisateur', Auth::id())
                      ->where('id_destinataire', $user->id);
                })
                ->orWhere(function($q) use ($user) {
                     $q->where('id_utilisateur', $user->id)
                       ->where('id_destinataire', Auth::id());
                });
            })
            ->orderBy('date_envoi', 'asc')
            ->get();

        return Inertia::render('Chat/Chat', [
            'users' => User::where('id', '!=', Auth::id())->get(),
            'selectedUser' => $user,
            'messages' => $messages,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Show the chat interface for a specific event and user.
     */
    public function showEventChat($evenement, User $user)
    {
        try {
            // Récupérer l'événement avec ses relations
            $evenement = Evenement::with(['organisateur', 'programmes'])->findOrFail($evenement);
            
            // Vérifier les autorisations
            if (Auth::id() !== $evenement->id_organisateur && Auth::id() !== $user->id) {
                return redirect()->route('evenements.show', $evenement->id_evenement)
                    ->with('error', 'Vous n\'avez pas accès à ce chat.');
            }

            // Récupérer les messages
            $messages = Message::with(['user', 'destinataire'])
                ->where('id_evenement', $evenement->id_evenement)
                ->where(function($query) use ($user) {
                    $query->where(function($q) use ($user) {
                        $q->where('id_utilisateur', Auth::id())
                          ->where('id_destinataire', $user->id);
                    })
                    ->orWhere(function($q) use ($user) {
                        $q->where('id_utilisateur', $user->id)
                          ->where('id_destinataire', Auth::id());
                    });
                })
                ->orderBy('date_envoi', 'asc')
                ->get();

            // Déterminer l'autre utilisateur
            $otherUser = (Auth::id() === $user->id) ? $evenement->organisateur : $user;

            // Préparer les données pour la vue
            $pageData = [
                'evenement' => $evenement,
                'otherUser' => $otherUser,
                'messages' => $messages,
                'auth' => [
                    'user' => Auth::user()
                ]
            ];

            // Retourner la vue EventChat avec le bon chemin
            return Inertia::render('Chat/EventChat', $pageData);

        } catch (\Exception $e) {
            return redirect()->route('evenements.show', $evenement)
                ->with('error', 'Une erreur est survenue lors de l\'accès au chat.');
        }
    }

    /**
     * Show the chat interface for a specific event and user directly, without conversation list.
     */
    public function showDirectEventChat(Evenement $evenement, User $user)
    {
        try {
            // Déterminer l'autre utilisateur
            // Si l'utilisateur connecté est celui passé en paramètre, l'autre utilisateur est l'organisateur de l'événement
            // Sinon, l'autre utilisateur est celui passé en paramètre.
            $otherUser = (Auth::id() === $user->id) ? $evenement->organisateur : $user;

            // Récupérer les messages entre l'utilisateur connecté et l'autre utilisateur pour cet événement spécifique
            $messages = Message::with(['user', 'destinataire'])
                ->where('id_evenement', $evenement->id_evenement)
                ->where(function($query) use ($user, $otherUser) {
                    $query->where(function($q) use ($user, $otherUser) {
                        $q->where('id_utilisateur', Auth::id())
                          ->where('id_destinataire', $otherUser->id);
                    })
                    ->orWhere(function($q) use ($user, $otherUser) {
                        $q->where('id_utilisateur', $otherUser->id)
                          ->where('id_destinataire', Auth::id());
                    });
                })
                ->orderBy('date_envoi', 'asc')
                ->get();

            // Préparer les données pour la vue
            $pageData = [
                'evenement' => $evenement,
                'otherUser' => $otherUser,
                'messages' => $messages,
                'auth' => [
                    'user' => Auth::user()
                ]
            ];

            // Retourner la vue EventChat avec le bon chemin
            return Inertia::render('Chat/EventChat', $pageData);

        } catch (\Exception $e) {
            // Gérer les erreurs et rediriger si nécessaire
            return redirect()->route('evenements.show', $evenement->id_evenement)
                ->with('error', 'Une erreur est survenue lors de l\'accès au chat.');
        }
    }

    public function get($userId)
    {
        $conversation = Conversation::where(function($query) use ($userId) {
            $query->where('user_id', auth()->id())
                  ->where('recipient_id', $userId);
        })->orWhere(function($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->where('recipient_id', auth()->id());
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_id' => auth()->id(),
                'recipient_id' => $userId
            ]);
        }

        $messages = $conversation->messages()->with('user')->get();

        return Inertia::render('Chat/Conversations', [
            'conversation' => $conversation,
            'messages' => $messages,
            'user' => \App\Models\User::find($userId)
        ]);
    }

    public function getMessages(User $user, Request $request)
    {
        try {
            $messages = Message::where(function ($query) use ($user) {
                $query->where('id_utilisateur', auth()->id())
                ->where('id_destinataire', $user->id);
            })->orWhere(function ($query) use ($user) {
            $query->where('id_utilisateur', $user->id)
                    ->where('id_destinataire', auth()->id());
            })
            ->when($request->has('evenement'), function ($query) use ($request) {
                return $query->where('id_evenement', $request->evenement);
        })
        ->orderBy('date_envoi', 'asc')
        ->get();

            // Marquer les messages comme lus
            Message::where('id_utilisateur', $user->id)
                ->where('id_destinataire', auth()->id())
                ->where('lu', false)
                ->update(['lu' => true]);

        return response()->json(['messages' => $messages]);
        } catch (\Exception $e) {
            Log::error('Erreur dans getMessages: ' . $e->getMessage());
            return response()->json(['error' => 'Une erreur est survenue lors de la récupération des messages'], 500);
        }
    }
}
