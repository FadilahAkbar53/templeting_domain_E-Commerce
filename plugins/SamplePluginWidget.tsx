import React, { useEffect } from "react";
import { useRegions } from "../hooks/useRegions";

interface WidgetContentProps {
  isSidebarMinimized?: boolean;
}

const WidgetContent: React.FC<WidgetContentProps> = ({
  isSidebarMinimized,
}) => {
  return (
    <div
      className={`
            flex items-center p-3 bg-theme-primary/10
            rounded-lg border border-theme-primary/30
            transition-all duration-300 ease-in-out
            ${isSidebarMinimized ? "justify-center" : ""}
        `}
    >
      <div className="p-2 bg-theme-primary/20 rounded-full flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-theme-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      </div>
      <div className={isSidebarMinimized ? "sr-only" : "inline ml-3"}>
        <h4 className="text-sm font-semibold text-theme-text-base">
          Free Shipping!
        </h4>
        <p className="text-xs text-theme-text-muted">
          On all orders over Rp 500.000.
        </p>
      </div>
    </div>
  );
};

const PromotionsWidget: React.FC = () => {
  const { registerComponent, unregisterComponent } = useRegions();
  const componentId = "promotions-widget";
  const regionName = "sidebar";

  useEffect(() => {
    // Register on mount
    registerComponent(regionName, componentId, WidgetContent);

    // Unregister on unmount
    return () => {
      unregisterComponent(regionName, componentId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerComponent, unregisterComponent]);

  // This component doesn't render anything itself, it just registers the content.
  return null;
};

export default PromotionsWidget;
