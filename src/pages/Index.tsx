import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CheckSquare, ArrowRight, LayoutDashboard, Users, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-2xl p-4 shadow-lg">
              <CheckSquare className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            TaskFlow
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Manage Projects Effortlessly
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The modern project management tool for teams. Organize tasks, collaborate in real-time, 
            and ship faster with TaskFlow's intuitive Kanban boards.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            {user ? (
              <Button size="lg" onClick={() => navigate("/dashboard")} className="shadow-lg">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate("/register")} className="shadow-lg">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow animate-slide-in-up">
            <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Kanban Boards</h3>
            <p className="text-muted-foreground">
              Visual project boards with drag-and-drop functionality. Organize tasks across To Do, In Progress, and Done columns.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-muted-foreground">
              Invite team members, assign tasks, and collaborate seamlessly. Keep everyone aligned and productive.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">
              See changes instantly. Task updates sync in real-time, so your team always has the latest information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
