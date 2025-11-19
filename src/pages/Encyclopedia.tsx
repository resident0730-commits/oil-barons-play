import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  Droplet, 
  Flame, 
  Hammer, 
  Zap,
  ArrowLeft,
  Clock,
  TrendingUp,
  Factory,
  Wrench,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock данные для статей
const articles = [
  {
    id: 1,
    title: "Что такое нефть и как она образуется?",
    category: "oil",
    excerpt: "Нефть — это природная маслянистая горючая жидкость, состоящая из сложной смеси углеводородов. Процесс её образования занимает миллионы лет...",
    readTime: "5 мин",
    difficulty: "Начальный",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400"
  },
  {
    id: 2,
    title: "Виды нефтяных скважин",
    category: "oil",
    excerpt: "Существует несколько типов нефтяных скважин: вертикальные, наклонно-направленные и горизонтальные. Каждый тип имеет свои преимущества...",
    readTime: "7 мин",
    difficulty: "Средний",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400"
  },
  {
    id: 3,
    title: "Природный газ: добыча и применение",
    category: "gas",
    excerpt: "Природный газ — это смесь газов, образовавшихся в недрах Земли. Основной компонент — метан. Используется как топливо и сырьё...",
    readTime: "6 мин",
    difficulty: "Начальный",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400"
  },
  {
    id: 4,
    title: "Буровое оборудование: основы",
    category: "equipment",
    excerpt: "Буровая установка — это комплекс машин и механизмов для бурения скважин. Включает буровую вышку, насосы, ротор и другие элементы...",
    readTime: "8 мин",
    difficulty: "Средний",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400"
  },
  {
    id: 5,
    title: "Технология гидроразрыва пласта",
    category: "technology",
    excerpt: "Гидроразрыв пласта (ГРП) — метод интенсификации добычи нефти и газа. Суть метода в создании трещин в породе для улучшения притока...",
    readTime: "10 мин",
    difficulty: "Продвинутый",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400"
  },
  {
    id: 6,
    title: "Экология и нефтедобыча",
    category: "technology",
    excerpt: "Современные технологии позволяют минимизировать воздействие на окружающую среду. Используются системы утилизации попутного газа...",
    readTime: "6 мин",
    difficulty: "Начальный",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400"
  },
  {
    id: 7,
    title: "Нефтепереработка: от сырья до продукта",
    category: "oil",
    excerpt: "Процесс переработки нефти включает несколько этапов: первичную перегонку, крекинг, риформинг. На выходе получают бензин, дизель...",
    readTime: "9 мин",
    difficulty: "Средний",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400"
  },
  {
    id: 8,
    title: "История нефтяной промышленности",
    category: "oil",
    excerpt: "Первая промышленная скважина была пробурена в 1859 году в США. С тех пор нефтяная индустрия прошла огромный путь развития...",
    readTime: "12 мин",
    difficulty: "Начальный",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400"
  }
];

const categories = [
  { id: "all", name: "Все статьи", icon: BookOpen, color: "bg-primary" },
  { id: "oil", name: "Нефть", icon: Droplet, color: "bg-orange-500" },
  { id: "gas", name: "Газ", icon: Flame, color: "bg-blue-500" },
  { id: "equipment", name: "Оборудование", icon: Hammer, color: "bg-purple-500" },
  { id: "technology", name: "Технологии", icon: Zap, color: "bg-green-500" }
];

const Encyclopedia = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const currentArticle = selectedArticle ? articles.find(a => a.id === selectedArticle) : null;

  if (currentArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedArticle(null)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к энциклопедии
          </Button>

          <article className="bg-card rounded-xl overflow-hidden shadow-xl">
            <div className="relative h-64 sm:h-96">
              <img 
                src={currentArticle.image} 
                alt={currentArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <Badge className="mb-2" variant="secondary">
                  {categories.find(c => c.id === currentArticle.category)?.name}
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {currentArticle.title}
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {currentArticle.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {currentArticle.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  {currentArticle.excerpt}
                </p>

                <h2 className="text-2xl font-bold mb-4">Основная информация</h2>
                <p className="mb-4">
                  Это демонстрационная статья энциклопедии. В реальной версии здесь будет полный текст статьи с подробным описанием темы, иллюстрациями, схемами и интерактивными элементами.
                </p>

                <h3 className="text-xl font-semibold mb-3">Ключевые моменты:</h3>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li>Подробное объяснение основных концепций</li>
                  <li>Исторический контекст и современное применение</li>
                  <li>Технические детали и процессы</li>
                  <li>Экономическая значимость</li>
                  <li>Влияние на окружающую среду</li>
                </ul>

                <div className="bg-muted/50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Интересный факт
                  </h4>
                  <p className="text-sm">
                    В будущих версиях энциклопедии каждая статья будет содержать интересные факты, инфографику и интерактивные элементы для лучшего понимания материала.
                  </p>
                </div>

                <h3 className="text-xl font-semibold mb-3">Практическое применение</h3>
                <p className="mb-4">
                  Здесь будет информация о том, как эти знания применяются на практике в нефтегазовой индустрии, какие технологии используются и какие перспективы развития существуют.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero секция */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-r from-primary to-primary/80 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <BookOpen className="h-16 w-16 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Энциклопедия нефти и газа
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl opacity-90">
            Откройте для себя мир полезных ископаемых: от основ до передовых технологий
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Поиск */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Поиск по статьям..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Категории */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  isActive ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold text-sm">{category.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {articles.filter(a => category.id === "all" || a.category === category.id).length} статей
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Статьи */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {activeCategory === "all" 
              ? "Все статьи" 
              : categories.find(c => c.id === activeCategory)?.name}
          </h2>
          <Badge variant="secondary">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'статья' : 'статей'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const category = categories.find(c => c.id === article.category);
            const Icon = category?.icon || BookOpen;
            
            return (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedArticle(article.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <div className={`${category?.color} p-2 rounded-full`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {category?.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {article.difficulty}
                    </Badge>
                    <Button variant="ghost" size="sm" className="group-hover:text-primary">
                      Читать →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Статьи не найдены</h3>
            <p className="text-muted-foreground">
              Попробуйте изменить поисковый запрос или выбрать другую категорию
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Encyclopedia;
