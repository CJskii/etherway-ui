import { ProjectDataType } from "../../api/project";

const linkMapping = {
  TWITTER: { label: "Twitter" },
  DISCORD: { label: "Discord" },
  TELEGRAM: { label: "Telegram" },
  GITHUB: { label: "Github" },
  WEBSITE: { label: "Website" },
};

export function getLinksProtocol(projectData: ProjectDataType) {
  if (!projectData || !projectData.links) {
    return [];
  }

  return projectData.links.map((link) => {
    const { label } = linkMapping[link.type] || {
      label: link.type,
    };
    return {
      label: label,
      href: link.url,
    };
  });
}
