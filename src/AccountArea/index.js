import { Alchemy, Network } from 'alchemy-sdk';
import { useState } from 'react';
import { Card, Col, Row, Input } from 'antd';
// import moment from 'moment';
import './index.css';
import ReceiptAndPaymentCard from './ReceiptAndPaymentCard'

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

function AccountArea() {
  const { Search } = Input;
  const [accountNo, setAccountNo] = useState();
  const [accountBalance, setAccountBalance] = useState();
  
  const onSearch = async () => {
    setReceiptions([])
    setPayment([])
    Promise.all([getBalance(), getTransactionRecs('1'), getTransactionRecs('2')]).then(res => {
        console.log(receiptions, payment);
        receiptions.length > 0 && console.log(parseInt(receiptions[0].blockNum));
        payment.length > 0 && console.log(parseInt(payment[0].blockNum));
    })
  };
  
    const getBalance = async () => {
      const res = await alchemy.core.getBalance(accountNo);
      console.log('account', res);
      setAccountBalance(parseInt(res));
    }

  const [receiptions, setReceiptions] = useState([]);
  const [payment, setPayment] = useState([]);

    // type 1: receiption 2: payment
  const getTransactionRecs = async (type) => {
    const paramsField = type === '1' ? 'toAddress' : 'fromAddress'
    const cb = type === '1' ? setReceiptions : setPayment
    let params = {
        order: 'desc',
        maxCount: 20,
        category: ["external", "internal", "erc20", "erc721", "erc1155", "specialnft"]
    };
    params[paramsField] = accountNo;
    const res = await alchemy.core.getAssetTransfers (params);
    cb(res.transfers)
  }

  return (
    <div class="account-area-wrapper">
      <div class="title"> Account Info Area </div>
      <Row gutter={16} style={{width: '100%'}}>
        <Col span={8}>
          <Card title="Block Info" bordered={false}>
            <Row gutter={24}>
              <Col span={24} class='card-field'>
                <div>Account Address: </div>
                <Search
                  placeholder="Account Address"
                  onSearch={onSearch}
                  style={{ width: '100%' }}
                  value={accountNo}
                  onChange={e => setAccountNo(e.target.value)}
                />
              </Col>
            </Row>
            <Row gutter={24} class='margin-top-15'>
              <Col span={24} class='card-field'>
                <div>Balance:</div>
                <div class='card-field-value'>{accountBalance}</div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Receiption Detail( Nearly 20 )" bordered={false} bodyStyle={{height: '20vw', overflow: 'scroll'}}>
            {
              receiptions.length > 0 && receiptions.map(ele => 
                <ReceiptAndPaymentCard detail={ele} type="1" key={ele.uniqueId} />
              )
            }
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Payment Detail( Nearly 20 )" bordered={false} bodyStyle={{height: '20vw', overflow: 'scroll'}}>
            {
              payment.length > 0 && payment.map(ele => 
                <ReceiptAndPaymentCard detail={ele} type="2" key={ele.uniqueId} />
              )
            }
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AccountArea;
