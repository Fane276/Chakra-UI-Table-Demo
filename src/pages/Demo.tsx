import axios from "axios"
import { DynamicDataTableProps, ColDef, DynamicDataTableResult } from "../types/DynamicDataTable";
import DynamicDataTable from "../components/DynamicDataTable";
import { Button, HStack, Image, Link, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text, VStack } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";

const Demo = () => {

  const tableRequest = async ({skipCount, pageSize}:DynamicDataTableProps, callback: (data:DynamicDataTableResult)=>Promise<any>) => {
    const options = {
      method: 'GET',
      url: `https://api.spaceflightnewsapi.net/v4/articles/?limit=${pageSize}&offset=${skipCount}`,
      headers: {
        'accept': 'application/json',
      }
    };
    
    const response = await axios.request(options);

    callback({
      items: response.data.results,
      totalCount: response.data.count
    })
  }

  const openInNewTab = (url:string) => {
    window.open(url, "_blank", "noreferrer");
  };

  const colDefs: Array<ColDef> = [
    {
      title: "Title",
      render: (item: any) => {
        return (
          <Popover>
            <HStack>
              <Text verticalAlign='baseline' isTruncated>
                {item.title}
              </Text>
              <PopoverTrigger>
                <Button variant='ghoast'><FaEye/></Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>{item.published_at}</PopoverHeader>
                <PopoverBody>
                  <VStack justifyContent={"start"} alignItems={"start"}>
                    <Text w="100%" fontSize='lg' textAlign={"left"} isTruncated>
                      {item.title}
                    </Text>
                    <Image src={item.image_url}/>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </HStack>
          </Popover>
        )
      }
    },
    {
      title: "News Web Site",
      width: "20%",
      render: (item: any) => {
        return item.news_site
      }
    },
    {
      title: "Last updated",
      width: "20%",
      render: (item: any) => {
        return item.updated_at
      }
    },
    {
      title: "Actions",
      width: "20%",
      render: (item: any) => {
        return (
          <Button colorScheme='blue' onClick={()=>openInNewTab(item.url)}>
            Read More
          </Button>
        )
      }
    }
  ]

  return (
    <DynamicDataTable request={tableRequest} pageSize={10} pagination={true}  colDefs={colDefs}/>
  )
}

export default Demo