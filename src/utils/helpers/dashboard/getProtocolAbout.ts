import { ProjectDataType } from "../../api/project";
import { BarChart, Crosshair, LayoutGrid, Star } from "lucide-react";

function capitalizeFirstLetter(string: string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const iconMapping = {
  difficulty: Crosshair,
  category: LayoutGrid,
  likelihood: BarChart,
  rating: Star,
};

export function getAboutProtocol(projectData: ProjectDataType) {
  if (!projectData) {
    return [];
  }

  return [
    {
      title: "Difficulty",
      value: capitalizeFirstLetter(projectData.difficulty),
      icon: iconMapping["difficulty"],
    },
    {
      title: "Category",
      value: projectData.category,
      icon: iconMapping["category"],
    },
    {
      title: "Likelihood",
      value: capitalizeFirstLetter(projectData.likelihood),
      icon: iconMapping["likelihood"],
    },
    {
      title: "Rating",
      value: projectData.rating,
      icon: iconMapping["rating"],
    },
  ];
}
