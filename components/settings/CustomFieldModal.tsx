"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const customFieldSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    fieldType: z.string(),
    options: z.string().optional(),
    required: z.boolean(),
    order: z.string(),
});

type CustomFieldFormData = z.infer<typeof customFieldSchema>;

interface CustomFieldModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    entityType: "CLIENT" | "PRODUCT";
    initialData?: {
        id?: string;
        name: string;
        fieldType: string;
        options?: string | null;
        required: boolean;
        order: number;
    };
}

export function CustomFieldModal({
    open,
    onClose,
    onSuccess,
    entityType,
    initialData,
}: CustomFieldModalProps) {
    const [loading, setLoading] = useState(false);
    const [fieldType, setFieldType] = useState("text");
    const [required, setRequired] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CustomFieldFormData>({
        resolver: zodResolver(customFieldSchema),
        defaultValues: {
            name: "",
            fieldType: "text",
            options: "",
            required: false,
            order: "0",
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                reset({
                    name: initialData.name,
                    fieldType: initialData.fieldType,
                    options: initialData.options || "",
                    required: initialData.required,
                    order: initialData.order.toString(),
                });
                setFieldType(initialData.fieldType);
                setRequired(initialData.required);
            } else {
                reset({
                    name: "",
                    fieldType: "text",
                    options: "",
                    required: false,
                    order: "0",
                });
                setFieldType("text");
                setRequired(false);
            }
        }
    }, [open, initialData, reset]);

    const onSubmit = async (data: CustomFieldFormData) => {
        setLoading(true);
        try {
            // Processar opções para tipo select
            let processedOptions = null;
            if (data.fieldType === "select" && data.options) {
                // Converter "opcao 1, opcao 2, opcao 3" para ["opcao 1", "opcao 2", "opcao 3"]
                const optionsArray = data.options
                    .split(",")
                    .map((opt) => opt.trim())
                    .filter((opt) => opt.length > 0);
                processedOptions = JSON.stringify(optionsArray);
            }

            const payload: any = {
                name: data.name,
                fieldType: data.fieldType,
                options: processedOptions,
                required: data.required,
                order: parseInt(data.order),
            };

            // Adicionar entityType apenas ao criar (POST), não ao editar (PATCH)
            if (!initialData?.id) {
                payload.entityType = entityType;
            }

            const url = initialData?.id
                ? `/api/admin/custom-fields/${initialData.id}`
                : "/api/admin/custom-fields";

            const method = initialData?.id ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.error || "Erro ao salvar campo");
            }

            toast({
                title: initialData?.id ? "✅ Campo atualizado!" : "✅ Campo criado!",
                description: `${data.name} foi salvo com sucesso.`,
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao salvar campo",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {initialData?.id ? "Editar Campo" : "Novo Campo Customizado"}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Para: {entityType === "CLIENT" ? "Clientes" : "Produtos"}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nome */}
                    <div>
                        <Label htmlFor="name">Nome do Campo *</Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="Ex: Fornecedor, Categoria, etc."
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Tipo */}
                    <div>
                        <Label htmlFor="fieldType">Tipo do Campo *</Label>
                        <Select
                            value={fieldType}
                            onValueChange={(value) => {
                                setFieldType(value);
                                setValue("fieldType", value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text">Texto</SelectItem>
                                <SelectItem value="number">Número</SelectItem>
                                <SelectItem value="date">Data</SelectItem>
                                <SelectItem value="select">Seleção (dropdown)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Opções (apenas para select) */}
                    {fieldType === "select" && (
                        <div>
                            <Label htmlFor="options">Opções (separadas por vírgula) *</Label>
                            <Textarea
                                id="options"
                                {...register("options")}
                                placeholder="Ex: Opção 1, Opção 2, Opção 3"
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Separe cada opção com vírgula
                            </p>
                        </div>
                    )}

                    {/* Ordem */}
                    <div>
                        <Label htmlFor="order">Ordem de Exibição</Label>
                        <Input
                            id="order"
                            type="number"
                            {...register("order")}
                            placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Campos serão exibidos em ordem crescente
                        </p>
                    </div>

                    {/* Obrigatório */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="required"
                            checked={required}
                            onCheckedChange={(checked) => {
                                setRequired(checked as boolean);
                                setValue("required", checked as boolean);
                            }}
                        />
                        <Label
                            htmlFor="required"
                            className="text-sm font-normal cursor-pointer"
                        >
                            Campo obrigatório
                        </Label>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading
                                ? "Salvando..."
                                : initialData?.id
                                    ? "Atualizar"
                                    : "Criar Campo"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
