'use client';

import { useState, useEffect } from 'react';
import { 
  FolderTree, 
  ChevronRight, 
  Plus, 
  MoreVertical, 
  Search, 
  ArrowLeft,
  LayoutGrid,
  Tags,
  Loader2
} from 'lucide-react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';

interface Category {
  _id: string;
  name: string;
  parentId: string | null;
  path: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [pathHistory, setPathPathHistory] = useState<{id: string | null, name: string}[]>([{id: null, name: 'Inicio'}]);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const fetchCategories = async (parentId: string | null) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const url = parentId ? `${apiUrl}/api/categories?parentId=${parentId}` : `${apiUrl}/api/categories`;
      const res = await fetch(url);
      const json = await res.json();
      setCategories(json.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentParentId);
  }, [currentParentId]);

  const navigateTo = (id: string | null, name: string) => {
    if (id === currentParentId) return;
    
    if (id === null) {
      setPathPathHistory([{id: null, name: 'Inicio'}]);
    } else {
      const index = pathHistory.findIndex(p => p.id === id);
      if (index !== -1) {
        setPathPathHistory(pathHistory.slice(0, index + 1));
      } else {
        setPathPathHistory([...pathHistory, {id, name}]);
      }
    }
    setCurrentParentId(id);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          heading="Categorías" 
          text="Organiza tu catálogo en niveles jerárquicos" 
        />
        <Button className="rounded-full gap-2">
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Breadcrumbs Navigation */}
      <div className="apple-card p-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {currentParentId !== null && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={() => {
              const prev = pathHistory[pathHistory.length - 2];
              navigateTo(prev.id, prev.name);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        {pathHistory.map((item, index) => (
          <div key={index} className="flex items-center shrink-0">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />}
            <button 
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                index === pathHistory.length - 1 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-secondary text-muted-foreground"
              )}
              onClick={() => navigateTo(item.id, item.name)}
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-12 space-y-6">
          <div className="flex items-center gap-4 bg-secondary/20 p-2 rounded-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Buscar dentro de esta categoría..." 
                className="bg-transparent border-none focus-visible:ring-0 pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="apple-card p-12 text-center flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-3xl bg-secondary/50 flex items-center justify-center text-muted-foreground">
                <FolderTree className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg">No hay sub-categorías</h3>
                <p className="text-sm text-muted-foreground">Esta categoría está vacía o es el último nivel.</p>
              </div>
              <Button variant="outline" className="rounded-full">Crear primera sub-categoría</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <div 
                  key={cat._id} 
                  className="group apple-card p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/[0.02] relative transition-all"
                  onClick={() => navigateTo(cat._id, cat.name)}
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                    <FolderTree className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm line-clamp-1">{cat.name}</h4>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
