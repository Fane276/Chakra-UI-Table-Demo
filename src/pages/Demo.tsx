import axios from "axios"
import { DynamicDataTableProps, ColDef, DynamicDataTableResult } from "../types/DynamicDataTable";
import DynamicDataTable from "../components/DynamicDataTable";

const Demo = () => {

  const tableRequest = async ({skipCount, pageSize}:DynamicDataTableProps, callback: (data:DynamicDataTableResult)=>Promise<any>) => {
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': 'f2958c3f15msh25a5bbad2521d01p17640fjsn40b32cc5ee30',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    };
    
    const response = await axios.request(options);

    response.data.response = response.data.response.slice(skipCount, skipCount + pageSize);

    callback({
      items: response.data.response,
      totalCount: response.data.results
    })
  }

  const colDefs: Array<ColDef> = [
    {
      title: "League",
      width: "20%",
      render: (item: any) => {
        return item.league.name
      }
    }
  ]

  return (
    <DynamicDataTable request={tableRequest} pageSize={10} pagination={true}  colDefs={colDefs}/>
  )
}

export default Demo