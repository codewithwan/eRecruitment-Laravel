import { ChevronUp, ChevronDown } from "lucide-react";
import React from "react";

interface SortButtonProps {
  sortOrder: 'asc' | 'desc';
  onToggle: () => void
}

const SortButton: React.FC<SortButtonProps> = ({ sortOrder, onToggle }: SortButtonProps) => {
  return(
    <button 
      onClick={onToggle}
      aria-label="Toggle sort order"
      className="cursor-pointer pt-1 translate-1"
    >
      {
        sortOrder === 'asc' 
          ? <ChevronUp size={18} />
          : <ChevronDown size={18} />
      }
    </button>  
  )
}

export default SortButton