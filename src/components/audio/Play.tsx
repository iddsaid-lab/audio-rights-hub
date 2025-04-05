
import React from 'react';
import { Play as PlayIcon } from 'lucide-react';

interface PlayProps {
  className?: string;
}

const Play: React.FC<PlayProps> = ({ className, ...props }) => {
  return <PlayIcon className={className} {...props} />;
};

export default Play;
