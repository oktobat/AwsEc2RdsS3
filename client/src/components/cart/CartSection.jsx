import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import {useSelector, useDispatch } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {fetchCart} from '@/store/product'

const serverUrl = import.meta.env.VITE_API_URL;

const TableBlock = styled.table`
col:nth-child(1) { width: 50px; }
col:nth-child(2) { width: 100px; }
col:nth-child(3) { width: auto; }
col:nth-child(4) { width: 100px; }
col:nth-child(5) { width: 100px; }
col:nth-child(6) { width: 100px; }
th,
  td {
    padding: 7px;
  }
  tbody {
    td:nth-child(4) {
      text-align: center;
      input {
        border: 1px solid #000;
        text-align: center;
        padding: 5px 0;
        width: 50px;
      }
    }
    td:nth-child(5) {
      text-align: right;
    }
    td:nth-child(6) {
      text-align: center;
      button {
        padding: 5px 8px;
        border-radius: 3px;
        background: red;
        color: #fff;
      }
    }
  }
  tfoot {
    td {
      text-align: center;
    }
  }
`

const Button = styled.div`
  text-align:center;
  button { padding:10px; margin:30px 10px }
`

const CartSection = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const carts = useSelector(state=>state.products.carts)
    const user = useSelector(state=>state.members.user)
   
    const [total, setTotal] = useState(0)
    const [allCount, setAllCount] = useState(0)

    // 각 제품에 대한 수량 상태를 관리하기 위한 상태
    const [quantityValues, setQuantityValues] = useState({});
    
    const onChange = (e, cNo, inventory) => {
        let newQty = parseInt(e.target.value)
        if (newQty<1) {
            newQty = 1
        }
        if (newQty>inventory) {
            newQty = inventory
        }
        setQuantityValues(prevState => ({
            ...prevState,
            [cNo]: newQty
        }));
        if (user) {
            axios.put(`${serverUrl}/product/cartQtyUpdate`, {cartNo:cNo, qty:newQty})
            .then((res) => {
                if (res.data.affectedRows==1) {
                    console.log("장바구니 수량 업데이트 성공")
                    dispatch(fetchCart(user.userNo))
                } else {
                    console.log("장바구니 수량 업데이트 실패")
                }
            })
            .catch((error) => {
                console.error('수량 업데이트 중 오류 발생:', error);
            });
        } 
    }

    const removeCartItem = (cNo)=>{
        if (user) {
            axios.delete(`${serverUrl}/product/cartItemRemove`, {params:{cartNo:cNo}})
            .then((res) => {
                if (res.data.affectedRows==1) {
                    console.log("장바구니 아이템 삭제 성공")
                    dispatch(fetchCart(user.userNo))
                } else {
                    console.log("장바구니 아이템 삭제 실패")
                }
            })
            .catch((error) => {
                console.error('삭제 중 오류 발생:', error);
            });
        } 
    }

    const allBuy = (e)=>{
        e.preventDefault()
        if (!user) {
            alert("로그인을 하십시오.")
            sessionStorage.setItem('previousUrl', '/cart');
            navigate("/login")
        } else {
            navigate("/payment", {state:{product: carts, path:'cart'}})
        }
    }

    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleToggle = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };


    const partBuy = (e)=>{
        e.preventDefault()
        if (!user) {
            alert("로그인을 하십시오.")
            sessionStorage.setItem('previousUrl', '/cart');
            navigate("/login")
        } else {
            const selectedProductsData = carts.filter(item => selectedProducts.includes(item.prNo));
            navigate("/payment", {state:{product:selectedProductsData, path:'cart'}})
        }
    }

    useEffect(() => {
        if (carts.length) {
            setTotal(carts.reduce((acc, item)=>acc+(parseInt(item.price) * parseInt(item.qty)), 0))
            setAllCount(carts.reduce((acc, item)=>acc+(parseInt(item.qty)), 0))
        } else {
            setTotal(0)
            setAllCount(0)
        }
    }, [carts]);

    return (
        <div>
            <TableBlock border="1">
                <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                </colgroup>
                <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>이미지</th>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>가격</th>
                        <th>기타</th>
                    </tr>
                </thead>
                { carts && carts.length ? 
                    <tbody>
                        {  carts.map((item, index)=>(
                                <tr key={index}>
                                    <td style={{textAlign:'center'}}><input type="checkbox" name="choice" onClick={()=>handleToggle(item.prNo)} /></td>
                                    <td>
                                        <img src={item.photo} alt={item.name} />
                                    </td>
                                    <td>
                                        { item.name } ({parseInt(item.price).toLocaleString()})
                                    </td>
                                    <td>
                                        <input type="number" value={quantityValues[item.cartNo] || item.qty}  onChange={ (e)=>onChange(e, item.cartNo, item.inventory) } />
                                    </td>
                                    <td>
                                        { (parseInt(item.price) * parseInt(item.qty)).toLocaleString() }
                                    </td>
                                    <td>
                                        <button type="button" onClick={ ()=>removeCartItem(item.cartNo) }>삭제</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody> 
                    : 
                    <tbody>
                        <tr>
                            <td 
                            colSpan="5" 
                            style={{padding: '100px 0', textAlign: 'center', fontSize: '30px'}}>
                                장바구니가 비어 있습니다.
                            </td>
                        </tr>
                    </tbody> 
                }
                <tfoot>
                    <tr>
                        <td colSpan="5">
                            총 주문금액 : { total.toLocaleString() }원 <br/>
                            주문상품수량 : { carts && carts.length }종 {allCount}개
                        </td>
                    </tr>
                </tfoot>
            </TableBlock>
            <Button>
                <button type="button" onClick={ partBuy }>선택상품 주문하기</button>
                <button type="button" onClick={ allBuy }>전체상품 주문하기</button>
            </Button>
        </div>
    );
};

export default CartSection;