import React from 'react';
import './CartPage.css';
import ArrowLeft from '../../Images/arrow-left.svg';
import ArrowRight from '../../Images/arrow-right.svg';
import {Link} from 'react-router-dom';

class CartPage extends React.Component {

    state = {
        currentImages: [],
        style: {objectPosition: '0% 0%'},
        overId: ''
      };


    handleMouseMove = (event) => {
        const { left, width, height, top: targetTop } = event.target.getBoundingClientRect()
        const {pageX, pageY} = event;
        const {scrollY} = window;
        const top = targetTop + scrollY;
        const x = (pageX - left) / width * 100
        const y = (pageY - top) / height * 100
        this.setState({style: {objectPosition: `${x}% ${y}%` }})
    }

    handleMouseLeave = () => {
        this.setState({overId: '', style: {objectPosition: '0% 0%' }})
    }

    setOverId = (props) => {
        this.setState({overId: props})
    }

    nextImage = (props) => {

        const {currentImages} = this.state;
        const {length: imagesLength} = currentImages;
        const {item, gallery} = props;
        const {length: galleryLength} = gallery;

        if(imagesLength === 0){
            const array = [];
            array.push({ item: item, currentImage: 1 })
            this.setState({currentImages: array});
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
                    this.setState({currentImages: array});
                    array.splice(array.indexOf(image), 1);
                }else{
                    array.push({ item: item, currentImage: 1 })
                    this.setState({currentImages: array});
                    array.splice(array.indexOf(image), 1);
                }
            })
        }
        this.setState({style: {objectPosition: '0% 0%' }})
    }

    previousImage = (props) => {

        const {currentImages} = this.state;
        const {length: imagesLength} = currentImages;
        const {item, gallery} = props;
        const {length: galleryLength} = gallery;

        if(imagesLength === 0){
            const array = [];
            array.push({ item: item, currentImage: galleryLength - 1 })
            this.setState({currentImages: array});
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
                    this.setState({currentImages: array});
                    array.splice(array.indexOf(image), 1);
                }else{
                    array.push({ item: item, currentImage: galleryLength - 1 })
                    this.setState({currentImages: array});
                    array.splice(array.indexOf(image), 1);
                }
            })
        }
        this.setState({style: {objectPosition: '0% 0%' }})
    } 
      
    render() {
        const {
            itemsInBag, 
            choosenCurrency, 
            currencyToShow,
            sumOfPrices,
            numberOfItemsInBag,
            generateListOfAttributes, 
            increaseQuantityOfProduct,
            removeFromBag } = this.props;

            const {length: itemsLength} = itemsInBag;
            const {symbol} = choosenCurrency;
            const {currentImages, overId, style} = this.state;
            const {length: imagesLength} = currentImages;
            const {previousImage, nextImage, setOverId, handleMouseLeave, handleMouseMove} = this;

            const taxRaw = 0.21 * sumOfPrices;
            const tax = taxRaw.toFixed(2);
            const sumRaw = parseFloat(sumOfPrices) + taxRaw;
            const sum = sumRaw.toFixed(2);

      return (
        
        <div className='cart-container'>
            <h1 className='cart-title'>Cart</h1>
            <div className='cart-page-items'>
            {!(itemsLength === 0)
            ? <>
                {itemsInBag.map((item) => {

                const {
                    cartId, 
                    category, 
                    id, 
                    brand, 
                    name, 
                    gallery, 
                    prices,
                    quantity,
                    choosenAttributes, 
                    attributes: itemAttributes} = item;

                const {length: galleryLength} = gallery;
                const toCompare = {item: cartId, gallery: gallery};
                let imageToShow = 0;

                if(!(imagesLength === 0)){
                    currentImages.forEach((image) => {
                        const {item: imageItem, currentImage} = image;
                        if(imageItem === cartId){
                            imageToShow = currentImage;
                        }
                    })
                }else{
                    imageToShow = 0;
                }
                
                const attributes = {attributes: itemAttributes, choosenAttributes: choosenAttributes, from: 'cart'};

                return (
                    <div key={cartId}>
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
                                    {generateListOfAttributes(attributes)}  
                                </div>
                            </div>
                            <div className='quantity'>
                                <span onClick={() => {increaseQuantityOfProduct(cartId)}} className='attribute-option plus-minus'>
                                +
                                </span>
                                <span className='attribute-number'>
                                    {quantity}
                                </span>
                                <span onClick={() => {removeFromBag(cartId)}} className='attribute-option plus-minus'>
                                -
                                </span>
                            </div>
                            <div className='gallery'>
                                {galleryLength > 1
                                ? <>
                                    <div onMouseEnter={() => {setOverId(cartId)}} onMouseLeave={handleMouseLeave} className='item-image-wrapper'>
                                        <div>
                                            <img 
                                            alt={name+' product'}
                                            onMouseMove={handleMouseMove}
                                            style={(overId === cartId) ? style : null} 
                                            className='item-image' 
                                            src={gallery[imageToShow]} />
                                        </div>
                                        <div>
                                            <div className='gallery-arrows'>
                                                <img onClick={() => {previousImage(toCompare)}} className='gallery-arrow-icon' src={ArrowLeft} alt='Previous'/>
                                                <img onClick={() => {nextImage(toCompare)}} className='gallery-arrow-icon' src={ArrowRight} alt='Next'/>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                : <div onMouseEnter={() => setOverId(cartId)} onMouseLeave={handleMouseLeave} className='item-image-wrapper'>
                                    <img 
                                    alt={name+' product'} 
                                    className='item-image' 
                                    onMouseMove={handleMouseMove} 
                                    style={(overId === cartId) ? style : null} 
                                    src={gallery[0]} />
                                </div>} 
                            </div>
                        </div>
                    </div>
                )})}
                <div className='divider'></div>
                <div className='price-summary'>
                    <div className='labels'>
                        <span>Tax 21%:</span>
                        <span>Quantity:</span>
                        <span>Total:</span>
                    </div>
                    <div className='values'>
                        <span className='bold'>{symbol}{tax}</span>
                        <span className='bold'>{numberOfItemsInBag}</span>
                        <span className='bold'>{symbol}{sum}</span>
                    </div>
                </div>
                <div className='wide-green-button'>
                    <span>Order</span>
                </div>
            </>
            : <span>Your cart is currently empty.</span>}
            </div>
        </div>
    );
  }}

  export default CartPage;