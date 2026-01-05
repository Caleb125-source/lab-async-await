const chai = require('chai');
global.expect = chai.expect;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

// Load HTML content
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');

// Transform JavaScript using Babel
const { code: transformedScript } = babel.transformFileSync(
  path.resolve(__dirname, '..', 'index.js'),
  { presets: ['@babel/preset-env'] }
);

// Initialize JSDOM
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

// Handle fetch for node
const fetchPkg = 'node_modules/whatwg-fetch/dist/fetch.umd.js';
dom.window.eval(fs.readFileSync(fetchPkg, 'utf-8'));

// Inject the transformed JavaScript into the virtual DOM
const scriptElement = dom.window.document.createElement("script");
scriptElement.textContent = transformedScript;
dom.window.document.body.appendChild(scriptElement);

// Expose JSDOM globals to the testing environment
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
global.Text = dom.window.Text;
global.XMLHttpRequest = dom.window.XMLHttpRequest;

// Helper: Wait until posts are loaded in the DOM
async function waitForPosts() {
  return new Promise((resolve) => {
    const check = () => {
      const firstH1 = document.querySelector("h1");
      const firstP = document.querySelector("p");
      if (firstH1 && firstP) {
        resolve();
      } else {
        setTimeout(check, 50); // check every 50ms
      }
    };
    check();
  });
}

// Test suite
describe('Asynchronous Fetching', () => {
  it('should fetch to external api and add information to page', async () => {
    await waitForPosts(); // wait until posts are in the DOM
    const postDisplay = document.querySelector("#post-list");
    expect(postDisplay.textContent).to.include('sunt aut'); // first post body from API
  });

  it('should create an h1 and p element to add', async () => {
    await waitForPosts(); // wait until posts are in the DOM
    const h1 = document.querySelector("h1");
    const p = document.querySelector("p");
    expect(h1).to.not.be.null;
    expect(p).to.not.be.null;
    expect(h1.textContent).to.be.a('string').and.to.not.be.empty;
    expect(p.textContent).to.be.a('string').and.to.not.be.empty;
  });
});
