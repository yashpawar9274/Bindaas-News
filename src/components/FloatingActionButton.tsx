import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingActionButton = () => {
  return (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default FloatingActionButton;