'use strict';
var React = require('react');

module.exports = function(ctx) {
  ctx.sender = ctx.sender || {};
  ctx.recipient = ctx.recipient || {};
  ctx.products = ctx.products || [];

  return React.renderToStaticMarkup(
    <html>
      <head>
        <base href={'file://' + __dirname + '/'} />
        <link rel="stylesheet" type="text/css" href="./style.css" />
      </head>
      <body>
        <div className="preview">
          <header>
            <h1 className="company">{ctx.sender.company}</h1>
            <div className="sender">
              <div className="name">{ctx.sender.name}</div>
              <div className="address">{ctx.sender.address}</div>
              <div className="city">{ctx.sender.postalCode} {ctx.sender.city}</div>
              <div className="phone">Phone: {ctx.sender.phone}</div>
              <div className="iban">IBAN: {ctx.sender.iban}</div>
              <div className="bic">BIC/SWIFT: {ctx.sender.bic}</div>
              <div className="companyId">Company ID: {ctx.sender.companyId}</div>
            </div>
            <div className="extra">
              <div className="invoice">INVOICE</div>
              <div className="date">{ctx.date}</div>
              <div className="reference"># {ctx.reference}</div>
            </div>
          </header>
          <article>
            <div className="info">
              <div className="recipient">
                <div className="company">{ctx.recipient.company}</div>
                <div className="name">{ctx.recipient.name}</div>
                <div className="address">{ctx.recipient.address}</div>
                <div className="city">{ctx.recipient.postalCode} {ctx.recipient.city}</div>
                <div className="phone">{ctx.recipient.phone}</div>
                <div className="companyId">{ctx.recipient.companyId}</div>
              </div>
            </div>
            <table className="products">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Tax free</th>
                  <th>Tax (%)</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
              {ctx.products.map(function(product, i) {
                return <tr key={i}>
                  <td>{product.name}</td>
                  <td>{toFixed(product.cost)}</td>
                  <td>{toFixed(product.vat)}</td>
                  <td>{toFixed(product.vatCost)}</td>
                  <td>{toFixed(product.total)}</td>
                </tr>;
              })}
              </tbody>
              <tfoot>
                <td>Total</td>
                <td>TODO</td>
                <td>TODO</td>
                <td>TODO</td>
                <td>TODO</td>
              </tfoot>
            </table>
          </article>
          <footer>
            <div className="companyDetails"></div>
          </footer>
        </div>
      </body>
    </html>
    );
};

function toFixed(a) {
    if(a) {
        return a.toFixed(2);
    }
}
