import { useState, useEffect } from "react";
import { Box, Flex, Select, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { DynamicDataTableOptions, DynamicDataTableResult } from "../types/DynamicDataTable";
import PageButton from './PageButton';


const DynamicDataTable = ({ pagination, pageSize, colDefs, request, t, ...props}: DynamicDataTableOptions) => {
  const [pageSizeInternal, setPageSizeInternal] = useState(pageSize? pageSize : 10);
  const [skipCount, setSkipCount] = useState(0);
  const [items, setItems] = useState(Array<any>);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [loading, setLoading] = useState(false)

  const callbackMethod = async (data: DynamicDataTableResult) => {
    setItems(data.items);
    setTotalCount(data.totalCount);
    return data;
  }

  useEffect(() => {
    setLoading(true);
    
    const asyncExecuter = async () => {
      await request({ skipCount, pageSize: pageSizeInternal }, callbackMethod);
      
    }
    if(pagination && skipCount!==undefined && pageSizeInternal !== undefined){
      asyncExecuter()
    }
    else if(pagination === false){
      asyncExecuter()
    }
    setLoading(false);
    return(() => {
      setLoading(false);
      setItems([]);
    })

  }, [skipCount, pageSizeInternal, pagination, request])

  useEffect(() => {
    var lastPage = Math.floor(totalCount / pageSizeInternal);
    setLastPage(lastPage);
  
    return () => {
      setLastPage(0)
    }
  }, [totalCount,pageSizeInternal])
  

  const handlePageChanged = (pageId: any) => {
    setCurrentPage(pageId);
    setSkipCount(Math.floor(pageId * pageSizeInternal));
  }

  const handleMaxCountChanged = (event: any) => {
    setPageSizeInternal(event.target.value);
  }
  return (
    <TableContainer>
      { loading && items ?
        <Text>Loading...</Text>
       :
        <Table {...props}>
          <TableCaption>
            <Flex direction='row' alignItems='center' justifyContent='space-between'>
              <Box>
                {t ? t("CurrentlyDisplayed") : "Currently displayed"} {items.length} {t ? t("outOf") : "out of"} {totalCount}
              </Box>
              {
                pagination &&
                  <Box>
                    <Select value={pageSizeInternal} onChange={handleMaxCountChanged} size='sm' borderRadius='10'>
                      {
                        [10, 15, 20, 25].map((selectOption) => {
                          return (
                            <option key={selectOption} value={selectOption}>{selectOption}</option>
                          )
                        })
                      }
                    </Select>
                  </Box>
              }
              { 
                pagination &&
                <Box>
                  <PageButton currentPage={currentPage} lastPage={lastPage} handlePageClick={handlePageChanged}></PageButton>
                </Box>
              }
            </Flex>
          </TableCaption>
          <Thead>
            <Tr>
              {
                colDefs.map((column,i) => {
                  return (
                    column.width ?
                      <Th key={i} w={column.width}>
                        {column.title}
                      </Th> :
                      <Th key={i}>
                        {column.title}
                      </Th>
                  )
                })
              }
            </Tr>
          </Thead>
          <Tbody>
            {
              items.length > 0 ?
                items.map((item, i) => {
                  return (
                    <Tr key={i}>
                      {
                        colDefs.map((column, j) => {
                          return (
                            column.width ?
                            <Td key={j} w={column.width}>
                              {column.render(item)}
                            </Td>
                            :
                            <Td key={j}>
                              {column.render(item)}
                            </Td>
                          )
                        })
                      }
                    </Tr>
                  )
                })
                :
                <Tr justifyContent='center' alignItems='center'>
                  <Td colSpan={6}>
                    <Text textAlign='center'>{t ? t("NoDataAvailable") : "No data available"}</Text>
                  </Td>
                </Tr>
            }
          </Tbody>
        </Table>

      }
    </TableContainer>
  )
}

export default DynamicDataTable