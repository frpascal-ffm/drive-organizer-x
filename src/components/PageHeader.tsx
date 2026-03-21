import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface Props {
  title: string;
  description?: string;
  back?: boolean;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, back, action }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-start gap-3">
        {back && (
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mt-0.5 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight leading-tight">{title}</h1>
          {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
