import express from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireAdmin } from "./middleware/requireAuth.js";

const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

//
// TEST
//

app.get("/", (req, res) => {
  res.json({
    message: "LUMÉ Beauty API is running",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!",
  });
});

//
// GET ALL PRODUCTS
// PUBLIC
//

app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

//
// CREATE PRODUCT
// PROTECTED
//

app.post("/api/products", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: Number(price),
        image: image || null,
        category: category || null,
        stock: Number(stock) || 0,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
});

//
// UPDATE PRODUCT
// PROTECTED
//

app.put("/api/products/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { name, description, price, image, category, stock } = req.body;

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description: description || null,
        price: Number(price),
        image: image || null,
        category: category || null,
        stock: Number(stock) || 0,
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
});

//
// DELETE PRODUCT
// PROTECTED
//

app.delete("/api/products/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
});

//
// ORDERS
//

//
// CREATE ORDER
// PUBLIC
//

app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, phone, address, notes, items } = req.body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({
        message: "Customer information and order items are required",
      });
    }
    // Validate items
    const validItems = items.every(
      (item) =>
        Number.isInteger(Number(item.productId)) &&
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) > 0,
    );

    if (!validItems) {
      return res.status(400).json({
        message: "Invalid order items",
      });
    }

    // Get products from database
    const productIds = items.map((item) => Number(item.productId));

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // Check that all products exist
    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: "One or more products were not found",
      });
    }

    // Check stock
    for (const item of items) {
      const product = products.find(
        (product) => product.id === Number(item.productId),
      );

      if (product.stock < Number(item.quantity)) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`,
        });
      }
    }

    // Calculate total from database prices
    let total = 0;

    const orderItems = items.map((item) => {
      const product = products.find(
        (product) => product.id === Number(item.productId),
      );

      const quantity = Number(item.quantity);

      total += product.price * quantity;

      return {
        productId: product.id,
        quantity,
        price: product.price,
      };
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        notes: notes || null,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Decrease stock
    for (const item of items) {
      await prisma.product.update({
        where: {
          id: Number(item.productId),
        },
        data: {
          stock: {
            decrement: Number(item.quantity),
          },
        },
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
});

//
// GET ALL ORDERS
// PROTECTED
//

app.get("/api/orders", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

//
// UPDATE ORDER STATUS
// PROTECTED
//

app.put("/api/orders/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);

    res.status(500).json({
      message: "Failed to update order",
    });
  }
});

//
// START SERVER
//

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`LUMÉ Beauty API running on port ${PORT}`);
});
