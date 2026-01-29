"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useConfirm } from "@/hooks/use-confirm";
import { formatCurrency } from "@/lib/utils";
import { ProductModal } from "@/components/products/ProductModal";

interface Product {
    id: string;
    name: string;
    stockCode: string;
    clients: Array<{ client: { id: string; name: string } }>;
    customFieldValues: Array<{
        customFieldId: string;
        value: string;
        customField: {
            id: string;
            name: string;
            fieldType: string;
        };
    }>;
}

export default function ProductsPage() {
    const { confirm, ConfirmDialog } = useConfirm();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);

            const res = await fetch(`/api/products?${params}`);
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar produtos",
                description: "Tente novamente mais tarde.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNewProduct = () => {
        setSelectedProduct(null);
        setModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleDeleteProduct = async (product: Product) => {
        const confirmed = await confirm({
            title: "Excluir Produto",
            description: `Tem certeza que deseja excluir o produto "${product.name}"? Esta ação não pode ser desfeita.`,
            confirmText: "Excluir",
        });

        if (!confirmed) {
            return;
        }

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao excluir produto");
            }

            toast({
                title: "✅ Produto excluído!",
                description: `${product.name} foi removido com sucesso.`,
            });

            fetchProducts();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao excluir produto",
                description: error.message,
            });
        }
    };

    // Helper para obter valor de um campo customizado
    const getCustomFieldValue = (product: Product, fieldName: string): string | null => {
        const field = product.customFieldValues.find(
            (cfv) => cfv.customField.name === fieldName
        );
        return field ? field.value : null;
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie seu catálogo de produtos
                    </p>
                </div>
                <Button onClick={handleNewProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                </Button>
            </div>

            {/* Busca */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome ou código..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Badge variant="secondary">
                    {products.length} produto{products.length !== 1 ? "s" : ""}
                </Badge>
            </div>

            {/* Grid de Produtos */}
            {products.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {search ? "Tente outro termo de busca" : "Comece adicionando seu primeiro produto"}
                        </p>
                        {!search && (
                            <Button onClick={handleNewProduct}>
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar Produto
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => {
                        const preco = getCustomFieldValue(product, "Preço");
                        const descricao = getCustomFieldValue(product, "Descrição");

                        return (
                            <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg line-clamp-1">
                                            {product.name}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Código: {product.stockCode}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteProduct(product)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {preco && (
                                            <div>
                                                <p className="text-2xl font-bold text-primary">
                                                    {formatCurrency(parseFloat(preco))}
                                                </p>
                                                <p className="text-xs text-muted-foreground">Preço unitário</p>
                                            </div>
                                        )}

                                        {descricao && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {descricao}
                                            </p>
                                        )}

                                        {/* Outros campos customizados */}
                                        {product.customFieldValues
                                            .filter((cfv) => cfv.customField.name !== "Preço" && cfv.customField.name !== "Descrição")
                                            .map((cfv) => (
                                                <div key={cfv.customFieldId} className="text-sm">
                                                    <span className="font-medium">{cfv.customField.name}:</span>{" "}
                                                    <span className="text-muted-foreground">{cfv.value}</span>
                                                </div>
                                            ))}

                                        <div className="pt-2 border-t">
                                            <p className="text-xs text-muted-foreground">
                                                Vinculado a {product.clients.length} cliente{product.clients.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Modal de Produto */}
            <ProductModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedProduct(null);
                }}
                onSuccess={fetchProducts}
                initialData={selectedProduct || undefined}
            />

            <ConfirmDialog />
        </div>
    );
}
