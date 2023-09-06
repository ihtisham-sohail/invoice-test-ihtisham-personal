'use client'
import { useState , useEffect } from "react";
import {
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon } from '@chakra-ui/icons'
import { PageWrapper } from "./components/pageWrapper";
import { GeneralBox } from "./components/generalBox";
import { DeleteModal } from "./components/deleteModal";
import { Customer, Invoice , LineItem , convertToDollar , dateFormat } from "@/utils/data-helpers";
import { fetchCall } from '@/utils/api-helper';

export default function Home() {

  
const { isOpen, onOpen, onClose } = useDisclosure()


  const [userId, setUserId] = useState('5ac51f7e-81b1-49c6-9c39-78b2d171abd6');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  const [totalAmount , setTotalAmount] = useState<number | 0>(0);
  const [totalPaid , setTotalPaid] = useState<number | 0>(0);
  const [totalOwed , setTotalOwed] = useState<number | 0>(0);
  const [totalDiscount , setTotalDiscount] = useState<number | 0>(0);

  useEffect(()=>{
    setCustomerInvoiceData();
  },[userId])

  const setCustomerInvoiceData = () =>{
    Promise.all([setInvoiceData , setCustomerData]);
  }

  const setCustomerData = () =>{
  return fetchCall(`/api/findCustomer/${userId}`).then(data=>
    setCustomer(data)
  );
  }

  const setInvoiceData = () =>{
    return fetchCall(`/api/invoices/${userId}?sortBy=asc`).then(data=>
      setInvoices(data)
    );
  }

  useEffect(()=>{
    calcTotals();
  },[invoices]);

  /**
   * calculating all totals of the invoice list
   * which includes Total Amount , Total Discount , Total Paid
   * and Total Owed
   */
  const calcTotals = () =>{
    if(invoices?.length){
      let sumTotal = 0;
      let redLiner = 0;
      let totalDis = 0;
      invoices.map((inv)=>{
        let rSum = inv.items.reduce((acc,item)=>{
          return acc+(item.price*item.quantity);
        },0);
  
        
        // checking discount if given
        let dis = inv.discount ? inv.discount : 0 ;

        // apply discount to total invoice
        let afterDisTotal = rSum-dis;
        sumTotal += afterDisTotal;

        // checking if settled
        let duePassed = !inv.settled ? afterDisTotal : 0;
        redLiner += duePassed;
        totalDis +=dis;
      })
  
      setTotalAmount(sumTotal);
      setTotalOwed(redLiner);
      setTotalPaid(sumTotal - redLiner);
      setTotalDiscount(totalDis);
    }
  }

  const totalItems = (items:LineItem[]) =>{
    const totalCents = items.reduce((acc,item:any)=>acc+(item.price*item.quantity),0);
    return convertToDollar(totalCents);
  }



  return (
    <>
      <PageWrapper>
        <GeneralBox>
          <Heading as="h2" size="lg">Invoices</Heading>
          <Text>Displaying invoices for <strong>{customer?.name}</strong></Text>
        </GeneralBox>

        <GeneralBox>
          <TableContainer overflowX="auto" overflowY="auto" maxH="25vh">
            <Table fontSize="sm" variant="striped" colorScheme="gray">
              <Thead>
                <Tr >
                  <Th position="sticky" left={0} top={0} zIndex="2" bg="white">Invoice #</Th>
                  <Th position="sticky" left={0} top={0} zIndex="1" bg="white">Date Due</Th>
                  <Th position="sticky" left={0} top={0} zIndex="1" bg="white">Date Sent</Th>
                  <Th position="sticky" left={0} top={0} zIndex="1" bg="white">Amount</Th>
                  <Th position="sticky" left={0} top={0} zIndex="1" bg="white"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {invoices && invoices.map(({
                   number,
                   id,
                   dateDue,
                   dateIssued,
                   items,
                   discount,
                   settled,
                 }) => (
                  <Tr key={id} color={settled ? '':'red'}>
                    <Td position="sticky" left={0} zIndex="1" bg="white">{number}</Td>
                    <Td>{dateFormat(dateDue)}</Td>
                    <Td>{dateFormat(dateIssued)}</Td>
                    <Td color={discount ? 'green':''}>{totalItems(items)}</Td>
                    <Td>{ settled ? 
                    <></> 
                    : 
                    <IconButton 
                    onClick={onOpen} 
                    aria-label='Delete invoice' 
                    isRound={true} 
                    colorScheme="red" 
                    size="sm" 
                    icon={<DeleteIcon />} />}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </GeneralBox>
        <Flex alignItems="flex-end" flexDirection="column">
        <GeneralBox>
            <Table fontSize="sm" variant="striped" colorScheme="gray">
              <Tbody>
                <Tr>
                  <Td><strong>Discount:</strong></Td>
                  <Td textAlign="right">{convertToDollar(totalDiscount)}</Td>
                </Tr>
                <Tr>
                  <Td><strong>Invoice Total:</strong></Td>
                  <Td textAlign="right">{convertToDollar(totalAmount)}</Td>
                </Tr>
                <Tr>
                  <Td><strong>Total Paid:</strong></Td>
                  <Td textAlign="right">{convertToDollar(totalPaid)}</Td>
                </Tr>
                <Tr>
                  <Td border="none"><strong>Total Owed:</strong></Td>
                  <Td border="none" textAlign="right">{convertToDollar(totalOwed)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </GeneralBox>
        </Flex>
      </PageWrapper>
      
      <DeleteModal isOpen={isOpen} onClose={onClose}>Are you sure? You cant undo this action afterwards.</DeleteModal>
    </>
  )
}
