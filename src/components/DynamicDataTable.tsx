import { useState, useEffect } from "react";
import { Box, Flex, Select, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { DynamicDataTableOptions, DynamicDataTableResult } from "../types/DynamicDataTable";
import PageButton from './PageButton';


const DynamicDataTable = ({ pagination, pageSize, colDefs, request, t }: DynamicDataTableOptions) => {
  const [maxResultCount, setMaxResultCount] = useState(10);
  const [skipCount, setSkipCount] = useState(0);
  const [items, setItems] = useState(Array<any>);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(0)

  const callbackMethod = async (data: DynamicDataTableResult) => {
    setItems(data.items);
    setTotalCount(data.totalCount);
    return data;
  }

  useEffect(() => {
    const asyncExecuter = async () => {
      await request({ skipCount, pageSize }, callbackMethod);
      var lastPage = Math.floor(totalCount / maxResultCount);
      setLastPage(lastPage);
    }
    asyncExecuter()

  }, [skipCount, maxResultCount])

  const handlePageChanged = (pageId: any) => {
    setCurrentPage(pageId);
    setSkipCount(Math.floor(pageId * maxResultCount));
  }

  const handleMaxCountChanged = (event: any) => {
    setMaxResultCount(event.target.value);
  }
  return (
    <TableContainer>

      <Table variant='striped' colorScheme='blue'>
        <TableCaption>
          <Flex direction='row' alignItems='center' justifyContent='space-between'>
            <Box>
              {t ? t("CurrentlyDisplayed") : "Currently displayed"} {items.length} {t ? t("outOf") : "Out of"} {totalCount}
            </Box>
            <Box>
              <Select value={maxResultCount} onChange={handleMaxCountChanged} size='sm' borderRadius='10'>
                {
                  [10, 15, 20, 25].map((selectOption) => {
                    return (
                      <option key={selectOption} value={selectOption}>{selectOption}</option>
                    )
                  })
                }
              </Select>
            </Box>
            <Box>
              <PageButton currentPage={currentPage} lastPage={lastPage} handlePageClick={handlePageChanged}></PageButton>
            </Box>
          </Flex>
        </TableCaption>
        <Thead>
          <Tr>
            {
              colDefs.map((column) => {
                return (
                  column.width ?
                    <Td w={column.width}>
                      {column.title}
                    </Td> :
                    <Td>
                      {column.title}
                    </Td>
                )
              })
            }
          </Tr>
        </Thead>
        <Tbody>
          {
            items.length > 0 ?
              items.map((item) => {
                return (
                  <Tr>
                    {
                      colDefs.map((column) => {
                        return (
                          <Td>
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
    </TableContainer>
  )
}

export default DynamicDataTable