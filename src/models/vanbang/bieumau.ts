import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<BieuMau.IRecord>('vanbang-bieumau');
  return {
    ...objInit,
  };
};
