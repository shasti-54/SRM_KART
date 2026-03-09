package com.srmkart.dto;

import java.util.List;

public class OrderRequest {
    private String shippingAddress;
    private List<OrderItemRequest> items;

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}
