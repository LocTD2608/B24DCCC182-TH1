import { useState } from 'react';

export interface ClubType {
  id: number;
  name: string;
  avatar?: string;
  foundedDate?: string;
  description?: string;
  president?: string;
  isActive?: boolean;
}

export default () => {
  const [clubs, setClubs] = useState<ClubType[]>([]);

  return {
    clubs,
    setClubs,
  };
};