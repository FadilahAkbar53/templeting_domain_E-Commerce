import React from 'react';
import { useRegions } from '../hooks/useRegions';

interface RegionProps {
  name: string;
  [key: string]: any;
}

const Region: React.FC<RegionProps> = ({ name, ...rest }) => {
  const { regions } = useRegions();
  const componentsToRender = regions[name] || [];

  if (componentsToRender.length === 0) {
    return (
        <div className="px-4 py-2 text-sm text-theme-text-muted">
            No components registered.
        </div>
    );
  }

  return (
    <>
      {componentsToRender.map(({ id, component: Component }) => (
        <Component key={id} {...rest} />
      ))}
    </>
  );
};

export default Region;