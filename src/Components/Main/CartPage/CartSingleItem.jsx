import { Component } from 'react'
import ArrowLeft from '../../../Images/arrow-left.svg';
import ArrowRight from '../../../Images/arrow-right.svg';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux'
import Attributes from '../Attributes';
import { increaseQuantityOfProduct, removeFromBag } from '../../../Utils'
import { decreaseNumberOfItemsInBag, increaseNumberOfItemsInBag, update } from '../../../Store'

class Item extends Component {

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

    setOverId = ({overId}) => {
        this.setState({overId: overId})
    }

    nextImage = ({item, gallery}) => {

        const {currentImages} = this.state;
        const {length: imagesLength} = currentImages;
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

    previousImage = ({item, gallery}) => {

        const {currentImages} = this.state;
        const {length: imagesLength} = currentImages;
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

    render(){

        const { 
            item,
            choosenCurrency,
            itemsInBag,
            currencyToShow } = this.props;

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

        const {currentImages, overId, style} = this.state;
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
                        <span onClick={() => {increaseQuantityOfProduct({
                                cartId: cartId, 
                                itemsInBag: itemsInBag, 
                                update: update, 
                                increaseNumberOfItemsInBag: increaseNumberOfItemsInBag})}
                            } className='attribute-option plus-minus'>
                        +
                        </span>
                        <span className='attribute-number'>
                            {quantity}
                        </span>
                        <span onClick={() => {removeFromBag({
                                cartId: cartId, 
                                itemsInBag: itemsInBag, 
                                update: update,
                                decreaseNumberOfItemsInBag: decreaseNumberOfItemsInBag})}
                            } className='attribute-option plus-minus'>
                        -
                        </span>
                    </div>
                    <div className='gallery'>
                        {galleryLength > 1
                        ? <>
                            <div onMouseEnter={() => {this.setOverId(cartId)}} onMouseLeave={this.handleMouseLeave} className='item-image-wrapper'>
                                <div>
                                    <img 
                                    alt={name+' product'}
                                    onMouseMove={this.handleMouseMove}
                                    $style={(overId === cartId) && style} 
                                    className='item-image' 
                                    src={gallery[imageToShow]} />
                                </div>
                                <div>
                                    <div className='gallery-arrows'>
                                        <img onClick={() => {this.previousImage(toCompare)}} className='gallery-arrow-icon' src={ArrowLeft} alt='Previous'/>
                                        <img onClick={() => {this.nextImage(toCompare)}} className='gallery-arrow-icon' src={ArrowRight} alt='Next'/>
                                    </div>
                                </div>
                            </div>
                        </>
                        : <div onMouseEnter={() => this.setOverId(cartId)} onMouseLeave={this.handleMouseLeave} className='item-image-wrapper'>
                            <img 
                            alt={name+' product'} 
                            className='item-image' 
                            onMouseMove={this.handleMouseMove} 
                            $style={(overId === cartId) && style} 
                            src={gallery[0]} />
                        </div>} 
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    choosenCurrency: state.choosenCurrency,
    itemsInBag: state.itemsInBag,
    currencyToShow: state.currencyToShow
})

const mapDispatchToProps = () => ({ 
    update,
    increaseNumberOfItemsInBag,
    decreaseNumberOfItemsInBag
});
  
export default connect(mapStateToProps, mapDispatchToProps())(Item);
  