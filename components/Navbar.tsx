
"use client"
import Link from "next/link"
import Image from "next/image"
import { Theme } from "./Themes"
import { IoIosMenu } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const [navOpen, setNavOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Get live session and auth status from NextAuth
    const { data: session, status } = useSession();
    const isLoggedIn = status === "authenticated";

    // Helper function to extract user initials if no profile picture exists
    const getInitials = (name?: string | null) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const navLinks = [
        { label: "Find Artisans", url: "/findartisan" },
        { label: "Services", url: "/services" },
        { label: "How it works", url: "/how-it-works" },
    ];

    return (
        <main className="flex justify-between items-center lg:px-20 py-2 border-b border-gray-200 bg-white sticky top-0 left-0 right-0 z-50">
            <Link href={'/'} className="flex items-center z-50">
                <Image
                    src={"/artisanlogo.jpeg"}
                    alt="logo"
                    width={800}
                    height={800}
                    className="w-20 h-20"
                    loading="eager"
                />
                <span className="tracking-tighter italic">Artisans<span style={{ color: Theme.primaryColor }} className="text-2xl font-bold">K</span>onnect</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="ml-auto flex items-center gap-6 max-lg:hidden space-around">
                {navLinks.map((item, i) => (
                    <article key={i}>
                        <Link href={item.url} className="text-lg">{item.label}</Link>
                    </article>
                ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="flex items-center gap-6 ml-6 max-lg:hidden">
                <Link href={'/become-an-artisan'} className="items-center border gap-1 px-3 py-0.5 rounded-xl border-gray-700">Become an Artisan</Link>
                
                {isLoggedIn ? (
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 overflow-hidden hover:opacity-90 transition-opacity focus:outline-none shadow-sm"
                        >
                            {/* Display Profile Image if available; otherwise display Orange Initial Badge */}
                            {session?.user?.image ? (
                                <Image 
                                    src={session.user.image} 
                                    alt="Profile" 
                                    width={40} 
                                    height={40} 
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div 
                                    className="w-full h-full flex items-center justify-center text-white font-bold text-base"
                                    style={{ backgroundColor: Theme.primaryColor }}
                                >
                                    {getInitials(session?.user?.name)}
                                </div>
                            )}
                        </button>

                        {/* Desktop Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-bold text-gray-800">{session?.user?.name || "User"}</p>
                                    <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                                </div>
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    View Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        signOut({ callbackUrl: "/" });
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-bold border-t border-gray-100"
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href={"/auth"} className="items-center border gap-1 px-7 py-1 rounded-xl border-gray-700 text-white tracking-wider font-bold" style={{ backgroundColor: Theme.primaryColor }}>Account</Link>
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setNavOpen(!navOpen)} className="lg:hidden z-50 text-3xl mr-2">
                {navOpen ? <IoIosClose /> : <IoIosMenu />}
            </button>

            {/* Mobile Navigation Menu */}
            <blockquote className={`lg:hidden absolute top-0 right-0 w-full h-dvh space-y-6 bg-white ${navOpen ? "block" : "hidden"}`}>
                <div className="pt-24 flex flex-col gap-10 items-center">
                    {navLinks.map((item, i) => (
                        <Link key={i} href={item.url} onClick={() => setNavOpen(false)} className="text-lg">{item.label}</Link>
                    ))}
                </div>
                
                <div className="flex flex-col items-center gap-6 mt-6">
                    <Link href={"/become-an-artisan"} onClick={() => setNavOpen(false)} className="flex items-center border gap-1 px-3 py-0.5 rounded-xl border-gray-700">Become an Artisan</Link>
                    
                    {isLoggedIn ? (
                        <div className="flex flex-col items-center gap-3 border-t border-gray-200 pt-6 w-full">
                            <div className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center">
                                {session?.user?.image ? (
                                    <Image src={session.user.image} alt="Profile" width={48} height={48} />
                                ) : (
                                    <div 
                                        className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                                        style={{ backgroundColor: Theme.primaryColor }}
                                    >
                                        {getInitials(session?.user?.name)}
                                    </div>
                                )}
                            </div>
                            <p className="font-medium text-gray-800">{session?.user?.name}</p>
                            <Link href="/profile" onClick={() => setNavOpen(false)} className="text-base text-gray-700">View Profile</Link>
                            <button 
                                onClick={() => {
                                    setNavOpen(false);
                                    signOut({ callbackUrl: "/" });
                                }} 
                                className="text-base text-red-600 font-medium"
                            >
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <Link href={"/auth"} onClick={() => setNavOpen(false)} style={{ backgroundColor: Theme.primaryColor, borderColor: Theme.primaryColor }} className="px-7 py-1 text-white border text-lg rounded-xl tracking-wider font-bold">Account</Link>
                    )}
                </div>
            </blockquote>
        </main>
    );
}