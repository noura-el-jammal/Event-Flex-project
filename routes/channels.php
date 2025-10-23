<?php

use Illuminate\Support\Facades\Broadcast;
 
Broadcast::channel('chat', function ($user) {
    return ['id' => $user->id, 'name' => $user->name];
}); 