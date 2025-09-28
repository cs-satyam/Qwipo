import React from 'react';
import { Card } from './MainContent';

const SupportContent = () => (
    <Card title="💬 AI Support & Help Center" className="shadow-lg">
      <p className="mb-4 text-muted border-bottom pb-3">
        Our **AI Chatbot** is ready to assist you instantly with order tracking, invoice requests, and troubleshooting.
      </p>
      
      {/* Chat Container */}
      <div className="d-flex flex-column" style={{ height: '24rem' }}>
        
        {/* Messages Display Area - Made scrollable */}
        <div className="flex-grow-1 overflow-y-auto p-3 mb-3 bg-light rounded-3 shadow-inset border border-light-subtle">
          
          {/* AI Message */}
          <div className="p-3 bg-primary-subtle rounded-3 align-self-start mb-2 shadow-sm" style={{ maxWidth: '75%' }}>
            <small className="text-primary fw-bold">AI Assistant</small>
            <p className="mb-0">Hello! I'm your dedicated AI supply chain assistant. How can I help you optimize your inventory or place a new order today?</p>
          </div>
          
          {/* User Message */}
          <div className="p-3 bg-success-subtle rounded-3 align-self-end mt-2 shadow-sm" style={{ maxWidth: '75%', marginLeft: 'auto' }}>
            <small className="text-success fw-bold">You</small>
            <p className="mb-0">Need to check the lead time for reordering Basmati Rice and see if there's a bulk discount.</p>
          </div>
          
          {/* AI Message */}
          <div className="p-3 bg-primary-subtle rounded-3 align-self-start mt-2 shadow-sm" style={{ maxWidth: '75%' }}>
            <small className="text-primary fw-bold">AI Assistant</small>
            <p className="mb-0">I see! Lead time is 48 hours. I've also found an extra **5% discount** on orders over 100 units. Should I apply this and add 120 units to your draft order?</p>
          </div>
        </div>
        
        {/* Input Area */}
        <div className="mt-auto d-flex gap-2">
          <input
            type="text"
            placeholder="Type your question or request here..."
            className="form-control flex-grow-1 border border-primary rounded-3 shadow-sm"
          />
          <button className="btn btn-primary py-2 rounded-3 fw-bold">
            Send
          </button>
        </div>
      </div>
    </Card>
);

export default SupportContent;