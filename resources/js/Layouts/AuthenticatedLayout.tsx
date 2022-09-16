import React, {useState} from 'react';
import Navbar from "../Components/Navbar";


//href={route('dashboard')} active={route().current('dashboard')}
//href={route('logout')}

export default function AuthenticatedLayout({auth, header, children}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar user={auth.user}/>
            <main>{children}</main>
        </div>
    );
}
