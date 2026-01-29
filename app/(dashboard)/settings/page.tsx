"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { CustomFieldsTab } from "@/components/settings/CustomFieldsTab";
import { UsersTab } from "@/components/settings/UsersTab";
import { PipelineStagesTab } from "@/components/settings/PipelineStagesTab";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("custom-fields");

    return (
        <div className="flex flex-col gap-6 p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie campos customizados, usuários e fases do funil
                    </p>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-2xl grid-cols-3">
                    <TabsTrigger value="custom-fields">Campos Customizados</TabsTrigger>
                    <TabsTrigger value="users">Usuários</TabsTrigger>
                    <TabsTrigger value="pipeline">Fases do Funil</TabsTrigger>
                </TabsList>

                <TabsContent value="custom-fields" className="mt-6">
                    <CustomFieldsTab />
                </TabsContent>

                <TabsContent value="users" className="mt-6">
                    <UsersTab />
                </TabsContent>

                <TabsContent value="pipeline" className="mt-6">
                    <PipelineStagesTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
