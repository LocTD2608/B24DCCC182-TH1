import { useState } from 'react';
import { useModel } from 'umi';
import SearchForm from './components/SearchForm';
import ResultTable from './components/ResultTable';

export default function Page() {
  const { search } = useModel('vanbang');
  const [data, setData] = useState([]);

  const handleSearch = async (params) => {
    const res = await search(params);
    setData(res.data || []);
  };

  return (
    <div>
      <h2>Tra cứu văn bằng</h2>

      <SearchForm onSearch={handleSearch} />

      <ResultTable data={data} />
    </div>
  );
}