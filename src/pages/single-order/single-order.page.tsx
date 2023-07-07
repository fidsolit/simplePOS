import "./single-order.css";
import useSingleOrder from "../../hooks/single-order.hook";
import { OrderCard } from '../../components';


const SingleOrder = () => {
    const { order, orderItems, splitDate, splitTime, subtotal } = useSingleOrder();
    return (
        <div className='singleOrderPage'>
            <div className="orderInfo">
                <h1>Order #{order?.orderNumber}</h1>
                <div className="wrapper">
                    <div className="left">
                        <span>Cachier : </span>
                        <span>Time : </span>
                        <span>Date : </span>
                        <span>Subtotal : </span>
                        <span>Disocunt code : </span>
                        <span>Tax(10%) : </span>
                        <span>Total : </span>
                    </div>
                    <div className="right">
                        <span className="name info">{order?.cashierName}</span>
                        <span className="info grey">{splitTime}</span>
                        <span className="info grey">{splitDate}</span>
                        <span className="info">{subtotal} $</span>
                        <span className="info">{order?.discountCode || 'No discount!'}</span>
                        <span className="info">{subtotal * 0.1} $</span>
                        <span className="info">{order?.total.toString()} $</span>
                    </div>
                </div>
            </div>
            <div className="orderDetails">
                <h2>Order Details</h2>
                <div className='OrderItems'> {
                    orderItems && orderItems.map(item =>
                        <OrderCard item={item} key={item._id} />
                    )}
                </div>
                <div className="itemsQuantity"># Items : {order?.items?.length} </div>
            </div>
        </div>
    );
};

export default SingleOrder;
