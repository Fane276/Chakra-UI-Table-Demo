import { Fragment, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, IconButton, useColorModeValue } from "@chakra-ui/react";
import { FaEllipsisH } from "react-icons/fa";

const PageButton = ({ currentPage, lastPage, handlePageClick }) => {
  const borderColor =  useColorModeValue('gray.200', 'gray.700');
  const [startIdx, setStartIdx] = useState();
  const [endIdx, setEndIdx] = useState();
  const [prevPage, setPrevPage] = useState();
  const [nextPage, setNextPage] = useState();
  const [items, setItems] = useState();

  useEffect(() => {
    setItems([]);
    if (currentPage - 1 >= 0) {
      setStartIdx(currentPage - 1);
      setEndIdx(startIdx + 1);
    } else {
      setStartIdx(0);
      setEndIdx(2);
    }
    if (currentPage + 2 >= lastPage) {
      if(lastPage-5>=0){
        setStartIdx(lastPage - 5);
        setEndIdx(lastPage);
      }
      else{
        setStartIdx(0);
        setEndIdx(1);
      }
    }

    setPrevPage(currentPage - 1);
    setNextPage(currentPage + 1);

    var newItems = [];

    for(let idx = startIdx; idx <= endIdx; idx++) {
      const offset = idx + 1;
      newItems.push({idx: idx, offset: offset});
    }
    setItems(newItems);

  }, [currentPage, lastPage])
  


  return(
    <>
    {currentPage - 1 >= 0 &&
      <IconButton
        icon={<ChevronLeftIcon />}
        value={prevPage}
        onClick={()=>handlePageClick(prevPage)}
        key={`prev-page-${prevPage}`}
        size='xs'
      />
    }
    {
      items &&
      items.map((item)=>{
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
      })
    }
    {endIdx < lastPage && 
      <Fragment key={`last-page-${lastPage}`}>
        <FaEllipsisH/>
        <Button onClick={()=>handlePageClick(lastPage)} value={lastPage - 1} size='xs' >
          {lastPage}
        </Button>
      </Fragment>
    }
    {currentPage + 1 <= lastPage &&
      <IconButton
        icon={<ChevronRightIcon />}
        value={nextPage}
        onClick={()=>handlePageClick(nextPage)}
        key={`next-page-${nextPage}`}
        size='xs'
      />
    }
    </>
  )
};

export default PageButton;