import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { Card, Col, Row, Input, Table } from 'antd';
import moment from 'moment';
import './index.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);
function BlockArea(props) {
  const { Search } = Input;
  const [blockNumber, setBlockNumber] = useState();
  
  useEffect(() => {
    async function initLastBlock() {
      if (!blockNumber) {
        setBlockNumber(props.latestBlockNumber)
        await getBlockInfo()
      }
    }
    initLastBlock()
  });
  const [blockInfo, setBlockInfo] = useState();
  
  const onSearch = async () => {
    await getBlockInfo();
    setTransactionDetail({})
  };

  const getBlockInfo = async () => {
    const res = await alchemy.core.getBlockWithTransactions(blockNumber);
    console.log('blockInfo', res);
    setBlockInfo(res);
  }

  const [transactionDetail, setTransactionDetail] = useState();
  const TransactionSelectHandler = async (transction) => {
    const res = await alchemy.core.getTransactionReceipt(transction.hash);
    console.log('transaction', res, parseInt(res.cumulativeGasUsed), parseInt(res.effectiveGasPrice));
    console.log('selected', transction)
    setTransactionDetail({gasUsed: res.gasUsed, ...transction})
  }

  const columns =[
    {
      title: 'Idx',
      dataIndex: 'transactionIndex',
      key: 'transactionIndex',
      width: 75
    },
    {
      title: 'Transaction Hash',
      dataIndex: 'hash',
      key: 'hash',
      ellipsis: true,
      className: 'font-size-12'
    }
  ]

  return (
    <div className="block-area-wrapper">
      <div className="title"> Block Info Area </div>
      <Row gutter={16} style={{width: '100%'}}>
        <Col span={8}>
          <Card title="Block Info" bordered={false}>
            <Row gutter={24}>
              <Col span={12} className='card-field'>
                <div>Block Number: </div>
                <Search
                  placeholder="Block Number"
                  onSearch={onSearch}
                  style={{ width: '100%' }}
                  value={blockNumber}
                  onChange={e => setBlockNumber(e.target.value)}
                />
              </Col>
              <Col span={12} className='card-field'>
                <div>Block Create Time:</div>
                <div className='card-field-value'>{blockInfo?.timestamp ? moment(parseInt(blockInfo.timestamp + '000')).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
              </Col>
            </Row>
            <Row gutter={24} className='margin-top-15'>
              <Col span={12} className='card-field'>
                <div>Transaction Nums:</div>
                <div className='card-field-value'>{blockInfo?.transactions?.length}</div>
              </Col>
              <Col span={12} className='card-field'>
                <div>Gas used:</div>
                <div className='card-field-value'>{parseInt(blockInfo?.gasUsed)}</div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Transaction List" bordered={false} bodyStyle={{padding: 0}}>
            <Table
              className='transcation-list'
              columns={columns}
              dataSource={blockInfo?.transactions}
              sticky={true}
              pagination={false}
              rowKey={rec => rec.hash}
              rowSelection={
                {
                  type: 'radio',
                  onSelect:(selected) => TransactionSelectHandler(selected)
                }
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Transaction Detail" bordered={false}>
            {
              transactionDetail?.hash && 
              <div>
                <Row gutter={24}>
                  <Col span={12} className='card-field'>
                    <div>From:</div>
                    <div className='card-field-value address'>{transactionDetail?.from}</div>
                  </Col>
                  <Col span={12} className='card-field'>
                    <div>To:</div>
                    <div className='card-field-value address'>{transactionDetail?.to}</div>
                  </Col>
                </Row>
                <Row gutter={24} className='margin-top-15'>
                  <Col span={12} className='card-field'>
                    <div>Val:</div>
                    <div className='card-field-value'>{parseInt(transactionDetail?.value)}</div>
                  </Col>
                  <Col span={12} className='card-field'>
                    <div>Gas Limit:</div>
                    <div className='card-field-value'>{parseInt(transactionDetail?.gasLimit)}</div>
                  </Col>
                </Row>
                <Row gutter={24} className='margin-top-15'>
                  <Col span={12} className='card-field'>
                    <div>Gas Price:</div>
                    <div className='card-field-value'>{parseInt(transactionDetail?.gasPrice)}</div>
                  </Col>
                  <Col span={12} className='card-field'>
                    <div>Gas Used:</div>
                    <div className='card-field-value'>{parseInt(transactionDetail?.gasUsed)}</div>
                  </Col>
                </Row>
              </div>
            }
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default BlockArea;
