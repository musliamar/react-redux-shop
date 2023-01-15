
import { useState } from 'react'
import ArrowLeft from '../../../Images/arrow-left.svg';
import ArrowRight from '../../../Images/arrow-right.svg';
import { Link } from 'react-router-dom';
import Attributes from '../Attributes';
import { increaseQuantityOfProduct, removeFromBag } from '../../../Store'
import { useSelector, useDispatch } from "react-redux";

function Item({ item }) {

    const dispatch = useDispatch()
    const [currentImages, setCurrentImages] = useState([])
    const [style, setStyle] = useState({objectPosition: '0% 0%'})
    const [overId, setOverId] = useState('')
    const choosenCurrency = useSelector((state) => state.choosenCurrency)
    const currencyToShow = useSelector((state) => state.currencyToShow)

    const handleMouseMove = (event) => {
        const { left, width, height, top: targetTop } = event.target.getBoundingClientRect()
        const {pageX, pageY} = event;
        const {scrollY} = window;
        const top = targetTop + scrollY;
        const x = (pageX - left) / width * 100
        const y = (pageY - top) / height * 100
        setStyle({objectPosition: `${x}% ${y}%` })
    }

    const handleMouseLeave = () => {
        setOverId('')
        setStyle({objectPosition: '0% 0%' })
    }

    const handleOver = (cartId) => {
        setOverId(cartId)
    }

    const nextImage = ({item, gallery}) => {
        const {length: imagesLength} = currentImages;
        const {length: galleryLength} = gallery;

        if(imagesLength === 0){
            const array = [];
            array.push({ item: item, currentImage: 1 })
            setCurrentImages(array);
        }else{
            currentImages.forEach((image) => {
                const {item: imageItem, currentImage} = image;
                const array = currentImages;
                if(imageItem === item){
                    if((galleryLength - 1) === currentImage){
                        array.push({ item: item, currentImage: 0 })
                    }else{
                        const hold = currentImage
                        array.push({ item: item, currentImage: hold + 1 })
                    }
                    setCurrentImages(array);
                    array.splice(array.indexOf(image), 1);
                }else{
                    array.push({ item: item, currentImage: 1 })
                    setCurrentImages(array);
                    array.splice(array.indexOf(image), 1);
                }
            })
        }
        setStyle({objectPosition: '0% 0%' })
    }

    const previousImage = ({item, gallery}) => {
        const {length: imagesLength} = currentImages;
        const {length: galleryLength} = gallery;

        if(imagesLength === 0){
            const array = [];
            array.push({ item: item, currentImage: galleryLength - 1 })
            setCurrentImages(array);
        }else{
            currentImages.forEach((image) => {
                const {item: imageItem, currentImage} = image;
                const array = currentImages;
                if(imageItem === item){
                    if(currentImage === 0){
                        array.push({ item: item, currentImage: galleryLength - 1 })
                    }else{
                        const hold = currentImage;
                        array.push({ item: item, currentImage: hold - 1 })
                    }
                    setCurrentImages(array);
                    array.splice(array.indexOf(image), 1);
                }else{
                    array.push({ item: item, currentImage: galleryLength - 1 })
                    setCurrentImages(array);
                    array.splice(array.indexOf(image), 1);
                }
            })
        }
        setStyle({objectPosition: '0% 0%' })
    } 

        const { cartId, 
            category, 
            id, 
            brand, 
            name, 
            gallery,
            inStock,
            choosenAttributes, 
            attributes: itemAttributes,
            prices,
            quantity} = item;
        
        const {length: galleryLength} = gallery;
        const toCompare = {item: cartId, gallery: gallery};
        let imageToShow = 0;
        const {symbol} = choosenCurrency;
        const {length: imagesLength} = currentImages;
        
        if((imagesLength !== 0)){
            currentImages.forEach((image) => {
                const {item: imageItem, currentImage} = image;
                if(imageItem === cartId){
                    imageToShow = currentImage;
                }
            })
        }else{
            imageToShow = 0;
        }
        
        return (
            <>
                <div className='divider'></div>
                <div className='single'>
                    <div className='summary'>
                        <div className='brand-name'>
                            <Link 
                            key={id} 
                            to={'/'+category+'/'+id}>
                                <span className='brand'>{brand}</span>
                                <span className='name'>{name}</span>
                            </Link>
                        </div>
                        <div className='price'>
                            <span>{symbol}{prices[currencyToShow].amount.toFixed(2)}</span>
                        </div>
                        <div className='attributes'>
                        <Attributes 
                            attributes = {itemAttributes} 
                            choosenAttributesFromCart = { choosenAttributes }
                            from = { 'cart' } 
                            inStock = { inStock } />
                        </div>
                    </div>
                    <div className='quantity'>
                        <span 
                            onClick={() => dispatch(increaseQuantityOfProduct({ cartId: cartId }))} 
                            className='attribute-option plus-minus'>
                        +
                        </span>
                        <span className='attribute-number'>
                            {quantity}
                        </span>
                        <span 
                            onClick={() => dispatch(removeFromBag({ cartId: cartId }))} 
                            className='attribute-option plus-minus'>
                        -
                        </span>
                    </div>
                    <div className='gallery'>
                        {galleryLength > 1
                        ? <>
                            <div onMouseEnter={() => handleOver(cartId)} onMouseLeave={handleMouseLeave} className='item-image-wrapper'>
                                <div>
                                    <img 
                                    alt={name+' product'}
                                    onMouseMove={handleMouseMove}
                                    style={(overId === cartId) ? style : undefined} 
                                    className='item-image' 
                                    src={gallery[imageToShow]} />
                                </div>
                                <div>
                                    <div className='gallery-arrows'>
                                        <img onClick={() => previousImage(toCompare)} className='gallery-arrow-icon' src={ArrowLeft} alt='Previous'/>
                                        <img onClick={() => nextImage(toCompare)} className='gallery-arrow-icon' src={ArrowRight} alt='Next'/>
                                    </div>
                                </div>
                            </div>
                        </>
                        : <div onMouseEnter={() => handleOver(cartId)} onMouseLeave={handleMouseLeave} className='item-image-wrapper'>
                            <img 
                            alt={name+' product'} 
                            className='item-image' 
                            onMouseMove={handleMouseMove} 
                            style={(overId === cartId) ? style : undefined} 
                            src={gallery[0]} />
                        </div>} 
                    </div>
                </div>
            </>
        )
    }
  
export default Item;
  