import React, { useState, useContext, useEffect } from "react";
import CartStore from "./CartStore";
import { cartNext, cartPrev } from "./CartAction";

const CartLeft = ({ courseCards, ingreCards, setCourseCards, setIngreCards }) => {
  const [cartTotal, setCartTotal] = useState(0);
  const [coupon, setCoupon] = useState()

  const [fnCartTotal, setFnCartTotal] = useState();
  const { step, cartPageDispatch, setcheckoutFinish } = useContext(CartStore);

  let CartTotal = (courseCards, ingreCards) => {
    if (courseCards && ingreCards) {
      let courseTotal = courseCards.reduce((courseCardA, courseCardB) => {
        return (
          courseCardA +
          courseCardB.course_order_applicants * courseCardB.course_price
        );
      }, 0);
      let ingreTotal = ingreCards.reduce((ingreCardA, ingreCardB) => {
        return (
          ingreCardA +
          ingreCardB.ingredient_order_quantity * ingreCardB.ingredients_price
        );
      }, 0);
      return courseTotal + ingreTotal;
    } else {
      return "沒有商品";
    }
  };

  const coponSelect = (e) => {
    const value = e.target.value;
    setCoupon(value);
  }
  const cartSubmit = async () => {
    try {
      const user = localStorage.getItem("member_id");
      const courseCart = localStorage.getItem(`courseCart${user}`);
      const ingreCart = localStorage.getItem(`ingreCart${user}`);
      console.log(courseCart, ingreCart);
      const cart = JSON.stringify({
        courseCart: courseCart,
        ingreCart: ingreCart,
        user: user,
        coupon: coupon
      });
      const url = `http://localhost:5000/handmade/cart/submitcart`;
      const dataJson = await fetch(url, {
        method: "POST",
        body: cart,
        headers: { "Content-Type": "application/json" }
      });
      const data = await dataJson.json();
      const order_Sid = await data[0].order_sid;
      let orderCreate_time = await data[0].order_create_time;
      let [orderDate, orderTime] = await orderCreate_time.split('T');
      orderTime = await orderTime.split('.')[0];
      alert(`訂單${order_Sid}於${orderDate}---${orderTime}新增完成`);
      localStorage.setItem(`courseCart${user}`, '[]');
      setCourseCards();
      localStorage.setItem(`ingreCart${user}`, '[]');
      setIngreCards();
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    setCartTotal(CartTotal(courseCards, ingreCards));
  }, [courseCards, ingreCards]);

  return (
    <>
      <div className="col-4 px-3 checkLeftBox">
        <div>
          <div className="checkPageIconBox d-flex align-items-center justify-content-around">
            <div
              className="d-flex align-items-center"
              onClick={() => cartPageDispatch(cartPrev())}
            >
              <div className="checkPageIcon cartStep">1</div>
              <h5 style={{ color: "#f78177", fontWeight: "bold" }}>
                確認數量/金額
            </h5>
            </div>
            <hr style={step ? { background: "#f78177" } : {}} />
            <div
              className="d-flex align-items-center"
              onClick={() => cartPageDispatch(cartNext())}
            >
              <div
                className="checkPageIcon cartStep2"
                style={step !== 0 ? { backgroundColor: "#f78177" } : {}}
              >
                2
            </div>
              <h5
                style={
                  step === 0
                    ? { color: "#fff" }
                    : { color: "#f78177", fontWeight: "bold" }
                }
              >
                選擇付款方式/結帳
            </h5>
            </div>
          </div>
          <div className="checkPageBox">
            <h4>訂單摘要</h4>
            <div className="checkTotal d-flex align-items-baseline justify-content-between">
              <p>商品總計</p>
              <h4>$ {cartTotal}</h4>
            </div>
            <div className="d-flex flex-column">
              <div className="checkOrderDeduct">
                <ul className="mt-4 w-100">
                  {!step ? (
                    <>
                      <li>
                        <p>可用優惠卷</p>
                        <select name="coupon" id="" onChange={(e) => { coponSelect(e) }}>
                          <option value="145678">145678</option>
                          <option value="145777">145777</option>
                        </select>
                      </li>
                      <li>
                        <p>可用紅利</p>
                        <h4>$ 55</h4>
                      </li>
                    </>
                  ) : (
                      ""
                    )}
                  <li>
                    <p>使用紅利</p>
                    {step === 0 ? <input type="text" /> : <h4>$ 55</h4>}
                  </li>
                  <li>
                    <p>其他折抵</p>
                    <h4>$ 70</h4>
                  </li>
                </ul>
              </div>
              <div>
                <div className="checkOrderTotal">
                  <p>結帳總額</p>
                  <h4>$ {}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        {step ? (
          <>
            <div className="creditCard">
              <div className="d-flex align-items-center">
                <input type="radio" name="pay" />
                <p>信用卡資料</p>
              </div>
              <div className="my-3">
                <input type="text" placeholder="0000-0000-0000-0000" />
              </div>
              <div className="creditCardDetail d-flex justify-content-end">
                <div className="d-flex align-items-center mr-4">
                  <p className="px-3">有效日期</p>
                  <input type="text" />
                </div>
                <input type="text" placeholder="驗證碼" />
              </div>
              <ul className="d-flex justify-content-between mt-4">
                <li>
                  <input type="radio" name="pay" value="LINE Pay" />
                  <p>LINE Pay</p>
                </li>
                <li>
                  <input type="radio" name="pay" value="APPLE Pay" />
                  <p>APPLE Pay</p>
                </li>
                <li>
                  <input type="radio" name="pay" value="GOOGLE Pay" />
                  <p>GOOGLE Pay</p>
                </li>
              </ul>
            </div>
          </>
        ) : (
            ""
          )}
        {!step ? (
          <button onClick={() => cartPageDispatch(cartNext())}>NEXT</button>
        ) : (
            <button onClick={() => cartSubmit()}>CHECK</button>
          )}
      </div>
    </>
  );
}

export default CartLeft;
