import { searchVanBang, getDetail } from '@/services/vanbang';

export default function useVanBangModel() {
  const search = async (params) => {
    return await searchVanBang(params);
  };

  const detail = async (id) => {
    return await getDetail(id);
  };

  return {
    search,
    detail,
  };
}