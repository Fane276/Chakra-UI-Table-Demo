import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, useColorModeValue } from "@chakra-ui/react";
import { PageNavigationProps } from "../types/DynamicDataTable";

const PageButton = ({ currentPage, lastPage, handlePageClick }: PageNavigationProps) => {
  const borderColor =  useColorModeValue('gray.600', 'gray.700');
  const [endIdx, setEndIdx] = useState(lastPage);
  const [prevPage, setPrevPage] = useState(0);
  const [nextPage, setNextPage] = useState(1);
  const [itemsBeforeCurrent, setItemsBeforeCurrent] = useState(Array<any>);
  const [itemsAfterCurrent, setItemsAfterCurrent] = useState(Array<any>);

  useEffect(() => {
    setPrevPage(currentPage - 1);
    setNextPage(currentPage + 1);
    setEndIdx(lastPage);
    
    var newItems = [];

    if(currentPage >= 3){
      for(let idx = 0; idx < 3; idx++) {
        const offset = idx + 1;
        newItems.push({idx: idx, offset: offset});
      }
    }
    else{
      if(endIdx - currentPage > 3){
        for(let idx = 0; idx < currentPage+2; idx++) {
          const offset = idx + 1;
          newItems.push({idx: idx, offset: offset});
        }
      }
      else{
        for(let idx = 0; idx < currentPage+1; idx++) {
          const offset = idx + 1;
          newItems.push({idx: idx, offset: offset});
        }
      }
    }
    setItemsBeforeCurrent(newItems);
    newItems = [];
    if(endIdx - currentPage > 3){
      
      for(let idx = endIdx - 3; idx < endIdx; idx++) {
        const offset = idx + 1;
        newItems.push({idx: idx, offset: offset});
      }
    }
    else{
      for(let idx = currentPage + 1; idx < endIdx; idx++) {
        const offset = idx + 1;
        newItems.push({idx: idx, offset: offset});
      }
    }
    setItemsAfterCurrent(newItems);
    
  }, [currentPage, endIdx, lastPage])
  


  return(
    <>
    {prevPage > 0 &&
      <Button
        value={prevPage}
        onClick={()=>handlePageClick(prevPage)}
        key={`prev-page-${prevPage}`}
        size='xs'
      >
        <ChevronLeftIcon />
      </Button>
    }
    {
      itemsBeforeCurrent &&
      <>
      {itemsBeforeCurrent.map((item)=>{
        return(
            <Button key={`page-${item.offset}`} 
              borderBottom='1px' 
              borderColor={currentPage === item.idx? {borderColor} : 'transparent'} 
              onClick={()=>handlePageClick(item.idx)} 
              value={item.idx}
              size='xs'
              >
              {item.offset}
            </Button>
        )
      })}
      {currentPage >= 3 &&
        <>...</>
      }
      </>
    }
    {currentPage >= 3 &&
      <Button key={`page-${currentPage+1}`} 
        borderBottom='1px' 
        borderColor={borderColor} 
        onClick={()=>handlePageClick(currentPage)} 
        value={currentPage}
        size='xs'
        >
        {currentPage + 1}
      </Button>
    }
    {
      
      itemsAfterCurrent && itemsAfterCurrent.length > 0 &&
      <>
        ...
        {itemsAfterCurrent.map((item)=>{
          return(
            <Button key={`page-${item.offset}`} 
            borderBottom='1px' 
            borderColor={currentPage === item.idx? {borderColor} : 'transparent'} 
            onClick={()=>handlePageClick(item.idx)} 
            value={item.idx}
            size='xs'
            >
            {item.offset}
          </Button>
          )
        })}
      </>
    }
    {nextPage <= lastPage &&
      <Button
        value={nextPage}
        onClick={()=>handlePageClick(nextPage)}
        key={`next-page-${nextPage}`}
        size='xs'
      >
        <ChevronRightIcon/>
      </Button>
    }
    </>
  )
};

export default PageButton;