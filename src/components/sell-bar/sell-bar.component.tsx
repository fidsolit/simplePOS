import "./sell-bar.css";
import React from "react";
import { ItemNS } from "../../types";
import { Button, Input } from "../core";
import SellCard from "../sell-card/sell-card.component";
import { useNotification } from '../../hooks';
import { OrderNS } from '../../types/order.type';
import { UserContext } from '../providers/user.provider';
import { orderService } from '../../services';
import { useDiscount } from "../../hooks";
interface IProps {
    selectedItems: {
        item: ItemNS.Item;
        number: number;
    }[];
    setSelectedItems: React.Dispatch<
        React.SetStateAction<
            {
                item: ItemNS.Item;
                number: number;
            }[]
        >
    >;
    price: number;
}
const SellBar = (props: IProps) => {
    const { selectedItems, setSelectedItems, price } = props
    const [totalPrice, setTotalPrice] = React.useState<number>(0);
    const tax = 0.10;
    const discount = useDiscount();
    const { setNotification } = useNotification();
    const user = React.useContext(UserContext);
    React.useEffect(() => {
        if (price !== 0)
            setTotalPrice((price + (price * tax)) - (price * (discount.discount / 100)));
        else setTotalPrice(0);
    }, [price, discount]);
    const itemsNumber = React.useMemo(() => {
        let count = 0;
        selectedItems.map(item => {
            count += item.number;
            return 1;
        });
        return count;
    }, [selectedItems]);

    const handleTransaction = async () => {
        if (itemsNumber === 0) {
            return setNotification({ message: 'There isn\'t any item in the list', status: 'warning' });
        }
        const items = selectedItems.map((item) => ({ item: item.item._id as string, quantity: item.number }));
        const order: OrderNS.IOrder = {
            cashierName: user.user?.fullName || 'unknown',
            total: totalPrice,
            items: items,
            tax: tax,
        };
        const addOrder = await orderService.addOrder(user.user?.token as string, order);
        if (addOrder) {
            setNotification({ message: 'Order performed successfully', status: 'success' });
            setSelectedItems([]);
            discount.setDiscountCode('')
            discount.setDiscount(0)
        }
        else {
            setNotification({ message: 'Something went wrong', status: 'error' });
        }
    };

    return (
        <div className="sellBarContainer">
            <div className="sectionOne">
                <div className="cardContainer">
                    {selectedItems?.map((item, index) => {
                        return (
                            <SellCard
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                                index={index}
                                key={index}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="sectionTwo">
                <div className="row">
                    <span>Item</span>
                    <span>{itemsNumber} (Items)</span>
                </div>
                <div className="row">
                    <span>Subtotal</span>
                    <span>{price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}$</span>
                </div>
                <div className="row" >
                    <span>Discount</span>
                    <span style={{ color: "#ef476f", fontWeight: 'bold' }}>{discount.discount}%</span>
                </div>
                <form className="row" onSubmit={(e) => discount.handleDiscount(e)}>
                    <Input
                        PlaceHolder='Discount code'
                        Height={28}
                        Width={90}
                        Radius={10}
                        Color="#03045e"
                        name="code"
                        onChange={e => discount.setDiscountCode(e.target.value)}
                        value={discount.discountCode}
                    />
                    <Button
                        HtmlType='submit'
                        Width='80'
                        Radius="10"
                        Color="#03045e"
                        FontSize="12"
                    >
                        Apply
                    </Button>
                </form>
                <div className="row" >
                    <span>Tax({(tax * 100)}%)</span>
                    <span>{(tax * price).toFixed(2)}$</span>
                </div>
            </div>
            <div className="sectionThree">
                <div className="row">
                    <span>Total</span>
                    <span>{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}$</span>
                </div>
                <Button
                    HtmlType="button"
                    Type="Primary"
                    Width="350"
                    Ratio="7/1"
                    Radius="40"
                    Color="#03045e"
                    FontColor="white"
                    FontWeight={700}
                    FontSize="21"
                    onClick={() => handleTransaction()}
                >
                    Process Transaction
                </Button>
            </div>
        </div>
    );
};

export default SellBar;