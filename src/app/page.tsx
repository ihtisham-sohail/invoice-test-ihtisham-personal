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
  TableContainer
} from "@chakra-ui/react";
import { PageWrapper } from "./components/pageWrapper";
import { GeneralBox } from "./components/generalBox";
import { Customer, Invoice , LineItem , convertToDollar , dateFormat } from "@/utils/data-helpers";
import { fetchCall } from '@/utils/api-helper';

export default function Home() {
  const [userId, setUserId] = useState('5ac51f7e-81b1-49c6-9c39-78b2d171abd6');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  const [totalAmount , setTotalAmount] = useState<number | 0>(0);
  const [totalPaid , setTotalPaid] = useState<number | 0>(0);
  const [totalOwed , setTotalOwed] = useState<number | 0>(0);
  const [totalDiscount , setTotalDiscount] = useState<number | 0>(0);
  
  useEffect(()=>{
    setCustomerData();
  },[userId])

  const setCustomerData =  ()=>{
    console.log('Called setting customer');
  fetchCall(`/api/findCustomer/${userId}`).then(data=>
    setCustomer(data)
  );
  }

  useEffect(()=>{
    if(customer){
      console.log('Called setting invoices');
      fetchCall(`/api/invoices/${userId}`).then(data=>
        setInvoices(data)
      );
    }

  },[customer])

  useEffect(()=>{
    calcTotals();
  },[invoices]);

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

  return (
    <>
      <PageWrapper>
        <GeneralBox>
          <Heading as="h2" size="lg">Invoices</Heading>
          <Text>Displaying invoices for <strong>{customer?.name}</strong></Text>
        </GeneralBox>

        <GeneralBox>
          <TableContainer>
            <Table fontSize="sm" variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Invoice #</Th>
                  <Th>Date Due</Th>
                  <Th>Date Sent</Th>
                  <Td></Td>
                </Tr>
              </Thead>
              <Tbody>
                {invoices && invoices.map(({
                   number,
                   id,
                   dateDue,
                   dateIssued,
                 }) => (
                  <Tr key={id}>
                    <Td>{number}</Td>
                    <Td>{dateDue.toString()}</Td>
                    <Td>{dateIssued.toString()}</Td>
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
    </>
  )
}
