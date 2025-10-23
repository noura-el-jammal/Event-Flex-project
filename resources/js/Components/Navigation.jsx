                    <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </NavLink>
                        <NavLink href={route('evenements.index')} active={route().current('evenements.index')}>
                            Événements
                        </NavLink>
                        <NavLink href={route('messages.index')} active={route().current('messages.index')}>
                            Messages
                        </NavLink>
                    </div> 