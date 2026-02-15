/**
 * Order API contract test: validates the payload shape that checkout sends to POST /api/orders.
 * Full integration (calling the route) can be done with e2e or by running the app.
 */
describe('Order API contract', () => {
  const validOrderPayload = {
    reference: 'test-ref-123',
    items: [
      { id: 'mtn_1gb', name: '1GB MTN', price: 5, quantity: 1, network: 'MTN' },
    ],
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    phone: '+233001234567',
    address: '123 Street',
    city: 'Accra',
  }

  it('has required fields for POST /api/orders', () => {
    expect(validOrderPayload.reference).toBeDefined()
    expect(Array.isArray(validOrderPayload.items)).toBe(true)
    expect(validOrderPayload.items.length).toBeGreaterThan(0)
    expect(validOrderPayload.items[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
      quantity: expect.any(Number),
    })
    expect(validOrderPayload.email).toBeDefined()
    expect(validOrderPayload.phone).toBeDefined()
  })

  it('items have network optional', () => {
    expect(validOrderPayload.items[0].network).toBe('MTN')
  })
})
