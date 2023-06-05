import './ReceiptAndPaymentCard.css'

function ReceiptAndPaymentCard(props) {
    return (
        <div class="card-wrapper">
            <div class="card-field">
                <div class="card-field-title">Value: </div>
                <div>{props.detail.value}</div>
            </div>
            <div class="card-field">
                <div class="card-field-title">Block Number: </div>
                <div>{props.detail.blockNum}</div>
            </div>
            <div class="card-field">
                <div class="card-field-title">Asset: </div>
                <div>{props.detail.asset}</div>
            </div>
            <div class="card-field">
                <div class="card-field-title">{props.type === '1' ? 'From: ' : 'To: '}</div>
                <div class="address">{props.type === '1' ? props.detail.from : props.detail.to}</div>
            </div>
        </div>
    )
}

export default ReceiptAndPaymentCard;