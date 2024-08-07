
const Cart = require('../model/cartSchema')
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const { userId } = req.params
        // Check if the product is already in the cart
        const existingCartItem = await Cart.findOne({ userId, productId });

        if (existingCartItem) {
            return res.json({
                message: 'Item is already in the cart',
                data: {
                    data: existingCartItem._id
                }
            });
        }

        // If the product is not in the cart, add it
        const cartEntry = new Cart({
            userId,
            productId,
            quantity,
        });

        const cartDetails = await cartEntry.save();

        res.json({
            message: 'Product added to cart',
            data: {
                data: cartDetails._id
            }
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart' });
    }
}

const deleteFromCart = async (req, res) => {
    try {
        const deletedCartItem = await Cart.deleteOne({ _id: req.params.cartId });

        if (deletedCartItem.deletedCount > 0) {
            res.status(200).json({ message: 'Item removed from cart' });
        } else {
            res.status(404).json({ message: 'Cart entry not found' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
}

const deleteManyFromCart = async (req, res) => {
    const itemIds = req.body
    console.log("itemIds", req.body);

    try {
        // Delete cart items by itemIds
        const deleteResult = await Cart.deleteMany({ _id: { $in: itemIds } });

        if (deleteResult.deletedCount > 0) {
            console.log(`${deleteResult.deletedCount} items removed from cart.`);
            return res.status(200).json({ message: 'Items removed from cart' });
        } else {
            console.log('No matching cart entries found.');
            return res.status(404).json({ message: 'No matching cart entries found' });
        }
    } catch (error) {
        console.error('Error removing items from cart:', error);
        res.status(500).json({ message: 'Error removing items from cart' });
    }
};




const displayCart = async (request, response) => {
    try {
        const userId = request.params.userId;
        //console.log(userId);
        const cartItems = await Cart.find({ userId: userId }).populate('productId');
        response.status(200).json({
            data: {
                data: cartItems
            }
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error fetching cart items' });
    }

}
const updateQuantity = async (req, res) => {
    try {
        console.log("inside the update quantity")
        const cartId = req.params.cartId;
        const { quantity } = req.body;

        const cartItem = await Cart.findOne({ _id: cartId });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        cartItem.quantity = quantity;
        const updatedCartItem = await cartItem.save();

        res.status(200).json({ message: 'Cart item quantity updated', data: updatedCartItem });
        console.log(updatedCartItem)
    } catch (error) {
        console.error('Error updating cart item quantity:', error);

        res.status(500).json({ message: 'Error updating cart item quantity' });
    }
}








module.exports.deleteFromCart = deleteFromCart;
module.exports.deleteManyFromCart = deleteManyFromCart
module.exports.addToCart = addToCart;
module.exports.displayCart = displayCart;
module.exports.updateQuantity = updateQuantity;
