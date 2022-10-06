import React, {useState} from 'react';
import Navbar from "../Components/AppHeader";


//href={route('dashboard')} active={route().current('dashboard')}
//href={route('logout')}

export default function AuthenticatedLayout({auth, children}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    return (
        <>
            <Navbar user={auth.user}/>
            <main>{children}</main>
        </>
    );
}
