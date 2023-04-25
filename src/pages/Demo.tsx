import axios from "axios"
import { DynamicDataTableProps, ColDef, DynamicDataTableResult } from "../types/DynamicDataTable";
import DynamicDataTable from "../components/DynamicDataTable";
import { Button, Card, Flex, HStack, Image, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text, VStack } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import { IoBeer } from "react-icons/io5";
import moment from "moment";

const Demo = () => {

  const tableSpaceFlightNewsRequest = async ({skipCount, pageSize}:DynamicDataTableProps, callback: (data:DynamicDataTableResult)=>Promise<any>) => {
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
  const tableBreweriesRequest = async ({skipCount, pageSize}:DynamicDataTableProps, callback: (data:DynamicDataTableResult)=>Promise<any>) => {
      var options = null;
      options = {
        method: 'GET',
        url: `https://api.openbrewerydb.org/v1/breweries`,
        headers: {
          'accept': 'application/json',
        }
      };
    
    const response = await axios.request(options);
    
    const totalLength = response.data.length;
    if(skipCount!==undefined && pageSize!==undefined){
      response.data = response.data.slice(skipCount, skipCount + pageSize)
    }

    callback({
      items: response.data,
      totalCount: totalLength
    })
  }

  const openInNewTab = (url:string) => {
    window.open(url, "_blank", "noreferrer");
  };

  const colSpaceFlightNewsDefs: Array<ColDef> = [
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
                <PopoverHeader>{moment(item.published_at).format("L LT")}</PopoverHeader>
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
        return moment(item.published_at).format("L LT")
      }
    },
    {
      title: "Actions",
      width: "20%",
      render: (item: any) => {
        return (
          <Button size='sm' onClick={()=>openInNewTab(item.url)}>
            Read More
          </Button>
        )
      }
    }
  ]

  
  const colBreweriesDefs: Array<ColDef> = [
    {
      title: "Title",
      render: (item: any) => {
        return item.name;
      }
    },
    {
      title: "Country",
      width: "20%",
      render: (item: any) => {
        return item.country
      }
    },
    {
      title: "City",
      width: "20%",
      render: (item: any) => {
        return item.city
      }
    },
    {
      title: "Type",
      width: "20%",
      render: (item: any) => {
        return item.brewery_type
      }
    },
    {
      title: "Phone",
      width: "20%",
      render: (item: any) => {
        return item.phone
      }
    },
    {
      title: "Actions",
      width: "20%",
      render: (item: any) => {
        return (
          <Button colorScheme='orange' variant='outline' bgColor='white' onClick={()=>openInNewTab(item.website_url)}>
            <HStack>
              <IoBeer/>
              <Text ml="2">
                Website
              </Text>
            </HStack>
          </Button>
        )
      }
    }
  ]

  return (
    <VStack m='20'>
      <Flex flexDirection='column' w={"100%"}>
        <Text textAlign="left" fontSize='4xl'>Space Flight News</Text>
        <Card w={"100%"}>
          <DynamicDataTable request={tableSpaceFlightNewsRequest} pageSize={10} pagination={true}  colDefs={colSpaceFlightNewsDefs} variant='striped' colorScheme='blue'/>
        </Card>
      </Flex>
      <Flex flexDirection='column' w={"100%"}>
        <Text textAlign="left" w={"100%"} fontSize='4xl'>Space Flight News No Pagination</Text>
        <Card w={"100%"}>
          <DynamicDataTable request={tableSpaceFlightNewsRequest} pageSize={10} pagination={false}  colDefs={colSpaceFlightNewsDefs} variant='striped' colorScheme="teal"/>
        </Card>
      </Flex>
      <Flex flexDirection='column' w={"100%"}>
        <Text textAlign="left" w={"100%"} fontSize='4xl'>Breweries</Text>
        <Card w={"100%"}>
          <DynamicDataTable request={tableBreweriesRequest} pageSize={10} pagination={true}  colDefs={colBreweriesDefs} variant='striped' colorScheme='orange' />
        </Card>
      </Flex>
    </VStack>
  )
}

export default Demo