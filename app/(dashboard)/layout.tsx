"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Kanban,
    Users,
    Calendar,
    Settings,
    BarChart3,
    Package,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pipeline", href: "/pipeline", icon: Kanban },
    { name: "Clientes", href: "/clients", icon: Users },
    { name: "Produtos", href: "/products", icon: Package },
    { name: "Agenda", href: "/calendar", icon: Calendar },
    { name: "Relatórios", href: "/reports", icon: BarChart3, gestorOnly: true },
    { name: "Configurações", href: "/settings", icon: Settings, gestorOnly: true },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role;

    const filteredNav = navigation.filter(
        (item) => !item.gestorOnly || userRole === "GESTOR"
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <div className="w-8 h-8 bg-gradient-sunset rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <span className="ml-3 text-xl font-bold">Sunset CRM</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {filteredNav.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-sunset rounded-full flex items-center justify-center text-white font-semibold">
                            {session?.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {session?.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {userRole === "GESTOR" ? "Gestor" : "Vendedor"}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64">
                <main className="min-h-screen">{children}</main>
            </div>
        </div>
    );
}
