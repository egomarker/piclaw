var xt=Object.defineProperty;var bt=(n)=>n;function vt(n,r){this[n]=bt.bind(null,r)}var nn=(n,r)=>{for(var i in r)xt(n,i,{get:r[i],enumerable:!0,configurable:!0,set:vt.bind(r,i)})};var C=(n,r)=>()=>(n&&(r=n(n=0)),r);var Gt={};nn(Gt,{useState:()=>p,useRef:()=>Q,useReducer:()=>Bc,useMemo:()=>X,useLayoutEffect:()=>Br,useImperativeHandle:()=>Mt,useErrorBoundary:()=>jt,useEffect:()=>P,useDebugValue:()=>Rt,useContext:()=>Nt,useCallback:()=>z,render:()=>An,html:()=>u,h:()=>mr,createContext:()=>Wt,Component:()=>mn});function en(n,r){for(var i in r)n[i]=r[i];return n}function ar(n){n&&n.parentNode&&n.parentNode.removeChild(n)}function mr(n,r,i){var c,o,t,s={};for(t in r)t=="key"?c=r[t]:t=="ref"?o=r[t]:s[t]=r[t];if(arguments.length>2&&(s.children=arguments.length>3?vr.call(arguments,2):i),typeof n=="function"&&n.defaultProps!=null)for(t in n.defaultProps)s[t]===void 0&&(s[t]=n.defaultProps[t]);return hr(n,s,c,o,null)}function hr(n,r,i,c,o){var t={type:n,props:r,key:i,ref:c,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:o==null?++ec:o,__i:-1,__u:0};return o==null&&Z.vnode!=null&&Z.vnode(t),t}function dr(n){return n.children}function mn(n,r){this.props=n,this.context=r}function Pn(n,r){if(r==null)return n.__?Pn(n.__,n.__i+1):null;for(var i;r<n.__k.length;r++)if((i=n.__k[r])!=null&&i.__e!=null)return i.__e;return typeof n.type=="function"?Pn(n):null}function Bt(n){if(n.__P&&n.__d){var r=n.__v,i=r.__e,c=[],o=[],t=en({},r);t.__v=r.__v+1,Z.vnode&&Z.vnode(t),ni(n.__P,t,r,n.__n,n.__P.namespaceURI,32&r.__u?[i]:null,c,i==null?Pn(r):i,!!(32&r.__u),o),t.__v=r.__v,t.__.__k[t.__i]=t,bc(c,t,o),r.__e=r.__=null,t.__e!=i&&wc(t)}}function wc(n){if((n=n.__)!=null&&n.__c!=null)return n.__e=n.__c.base=null,n.__k.some(function(r){if(r!=null&&r.__e!=null)return n.__e=n.__c.base=r.__e}),wc(n)}function Or(n){(!n.__d&&(n.__d=!0)&&bn.push(n)&&!br.__r++||mi!=Z.debounceRendering)&&((mi=Z.debounceRendering)||gc)(br)}function br(){try{for(var n,r=1;bn.length;)bn.length>r&&bn.sort(pc),n=bn.shift(),r=bn.length,Bt(n)}finally{bn.length=br.__r=0}}function yc(n,r,i,c,o,t,s,_,l,e,x){var f,y,$,v,W,w,k,R=c&&c.__k||xr,j=r.length;for(l=Tt(i,r,R,l,j),f=0;f<j;f++)($=i.__k[f])!=null&&(y=$.__i!=-1&&R[$.__i]||yr,$.__i=f,w=ni(n,$,y,o,t,s,_,l,e,x),v=$.__e,$.ref&&y.ref!=$.ref&&(y.ref&&ri(y.ref,null,$),x.push($.ref,$.__c||v,$)),W==null&&v!=null&&(W=v),(k=!!(4&$.__u))||y.__k===$.__k?(l=xc($,l,n,k),k&&y.__e&&(y.__e=null)):typeof $.type=="function"&&w!==void 0?l=w:v&&(l=v.nextSibling),$.__u&=-7);return i.__e=W,l}function Tt(n,r,i,c,o){var t,s,_,l,e,x=i.length,f=x,y=0;for(n.__k=Array(o),t=0;t<o;t++)(s=r[t])!=null&&typeof s!="boolean"&&typeof s!="function"?(typeof s=="string"||typeof s=="number"||typeof s=="bigint"||s.constructor==String?s=n.__k[t]=hr(null,s,null,null,null):kr(s)?s=n.__k[t]=hr(dr,{children:s},null,null,null):s.constructor===void 0&&s.__b>0?s=n.__k[t]=hr(s.type,s.props,s.key,s.ref?s.ref:null,s.__v):n.__k[t]=s,l=t+y,s.__=n,s.__b=n.__b+1,_=null,(e=s.__i=Ft(s,i,l,f))!=-1&&(f--,(_=i[e])&&(_.__u|=2)),_==null||_.__v==null?(e==-1&&(o>x?y--:o<x&&y++),typeof s.type!="function"&&(s.__u|=4)):e!=l&&(e==l-1?y--:e==l+1?y++:(e>l?y--:y++,s.__u|=4))):n.__k[t]=null;if(f)for(t=0;t<x;t++)(_=i[t])!=null&&(2&_.__u)==0&&(_.__e==c&&(c=Pn(_)),kc(_,_));return c}function xc(n,r,i,c){var o,t;if(typeof n.type=="function"){for(o=n.__k,t=0;o&&t<o.length;t++)o[t]&&(o[t].__=n,r=xc(o[t],r,i,c));return r}n.__e!=r&&(c&&(r&&n.type&&!r.parentNode&&(r=Pn(n)),i.insertBefore(n.__e,r||null)),r=n.__e);do r=r&&r.nextSibling;while(r!=null&&r.nodeType==8);return r}function Ft(n,r,i,c){var o,t,s,_=n.key,l=n.type,e=r[i],x=e!=null&&(2&e.__u)==0;if(e===null&&_==null||x&&_==e.key&&l==e.type)return i;if(c>(x?1:0)){for(o=i-1,t=i+1;o>=0||t<r.length;)if((e=r[s=o>=0?o--:t++])!=null&&(2&e.__u)==0&&_==e.key&&l==e.type)return s}return-1}function nc(n,r,i){r[0]=="-"?n.setProperty(r,i==null?"":i):n[r]=i==null?"":typeof i!="number"||dt.test(r)?i:i+"px"}function pr(n,r,i,c,o){var t,s;n:if(r=="style")if(typeof i=="string")n.style.cssText=i;else{if(typeof c=="string"&&(n.style.cssText=c=""),c)for(r in c)i&&r in i||nc(n.style,r,"");if(i)for(r in i)c&&i[r]==c[r]||nc(n.style,r,i[r])}else if(r[0]=="o"&&r[1]=="n")t=r!=(r=r.replace($c,"$1")),s=r.toLowerCase(),r=s in n||r=="onFocusOut"||r=="onFocusIn"?s.slice(2):r.slice(2),n.l||(n.l={}),n.l[r+t]=i,i?c?i[an]=c[an]:(i[an]=Sr,n.addEventListener(r,t?Yr:Zr,t)):n.removeEventListener(r,t?Yr:Zr,t);else{if(o=="http://www.w3.org/2000/svg")r=r.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(r!="width"&&r!="height"&&r!="href"&&r!="list"&&r!="form"&&r!="tabIndex"&&r!="download"&&r!="rowSpan"&&r!="colSpan"&&r!="role"&&r!="popover"&&r in n)try{n[r]=i==null?"":i;break n}catch(_){}typeof i=="function"||(i==null||i===!1&&r[4]!="-"?n.removeAttribute(r):n.setAttribute(r,r=="popover"&&i==1?"":i))}}function rc(n){return function(r){if(this.l){var i=this.l[r.type+n];if(r[$r]==null)r[$r]=Sr++;else if(r[$r]<i[an])return;return i(Z.event?Z.event(r):r)}}}function ni(n,r,i,c,o,t,s,_,l,e){var x,f,y,$,v,W,w,k,R,j,d,M,h,T,G,g=r.type;if(r.constructor!==void 0)return null;128&i.__u&&(l=!!(32&i.__u),t=[_=r.__e=i.__e]),(x=Z.__b)&&x(r);n:if(typeof g=="function")try{if(k=r.props,R=g.prototype&&g.prototype.render,j=(x=g.contextType)&&c[x.__c],d=x?j?j.props.value:x.__:c,i.__c?w=(f=r.__c=i.__c).__=f.__E:(R?r.__c=f=new g(k,d):(r.__c=f=new mn(k,d),f.constructor=g,f.render=Kt),j&&j.sub(f),f.state||(f.state={}),f.__n=c,y=f.__d=!0,f.__h=[],f._sb=[]),R&&f.__s==null&&(f.__s=f.state),R&&g.getDerivedStateFromProps!=null&&(f.__s==f.state&&(f.__s=en({},f.__s)),en(f.__s,g.getDerivedStateFromProps(k,f.__s))),$=f.props,v=f.state,f.__v=r,y)R&&g.getDerivedStateFromProps==null&&f.componentWillMount!=null&&f.componentWillMount(),R&&f.componentDidMount!=null&&f.__h.push(f.componentDidMount);else{if(R&&g.getDerivedStateFromProps==null&&k!==$&&f.componentWillReceiveProps!=null&&f.componentWillReceiveProps(k,d),r.__v==i.__v||!f.__e&&f.shouldComponentUpdate!=null&&f.shouldComponentUpdate(k,f.__s,d)===!1){r.__v!=i.__v&&(f.props=k,f.state=f.__s,f.__d=!1),r.__e=i.__e,r.__k=i.__k,r.__k.some(function(K){K&&(K.__=r)}),xr.push.apply(f.__h,f._sb),f._sb=[],f.__h.length&&s.push(f);break n}f.componentWillUpdate!=null&&f.componentWillUpdate(k,f.__s,d),R&&f.componentDidUpdate!=null&&f.__h.push(function(){f.componentDidUpdate($,v,W)})}if(f.context=d,f.props=k,f.__P=n,f.__e=!1,M=Z.__r,h=0,R)f.state=f.__s,f.__d=!1,M&&M(r),x=f.render(f.props,f.state,f.context),xr.push.apply(f.__h,f._sb),f._sb=[];else do f.__d=!1,M&&M(r),x=f.render(f.props,f.state,f.context),f.state=f.__s;while(f.__d&&++h<25);f.state=f.__s,f.getChildContext!=null&&(c=en(en({},c),f.getChildContext())),R&&!y&&f.getSnapshotBeforeUpdate!=null&&(W=f.getSnapshotBeforeUpdate($,v)),T=x!=null&&x.type===dr&&x.key==null?vc(x.props.children):x,_=yc(n,kr(T)?T:[T],r,i,c,o,t,s,_,l,e),f.base=r.__e,r.__u&=-161,f.__h.length&&s.push(f),w&&(f.__E=f.__=null)}catch(K){if(r.__v=null,l||t!=null)if(K.then){for(r.__u|=l?160:128;_&&_.nodeType==8&&_.nextSibling;)_=_.nextSibling;t[t.indexOf(_)]=null,r.__e=_}else{for(G=t.length;G--;)ar(t[G]);Jr(r)}else r.__e=i.__e,r.__k=i.__k,K.then||Jr(r);Z.__e(K,r,i)}else t==null&&r.__v==i.__v?(r.__k=i.__k,r.__e=i.__e):_=r.__e=zt(i.__e,r,i,c,o,t,s,l,e);return(x=Z.diffed)&&x(r),128&r.__u?void 0:_}function Jr(n){n&&(n.__c&&(n.__c.__e=!0),n.__k&&n.__k.some(Jr))}function bc(n,r,i){for(var c=0;c<i.length;c++)ri(i[c],i[++c],i[++c]);Z.__c&&Z.__c(r,n),n.some(function(o){try{n=o.__h,o.__h=[],n.some(function(t){t.call(o)})}catch(t){Z.__e(t,o.__v)}})}function vc(n){return typeof n!="object"||n==null||n.__b>0?n:kr(n)?n.map(vc):en({},n)}function zt(n,r,i,c,o,t,s,_,l){var e,x,f,y,$,v,W,w=i.props||yr,k=r.props,R=r.type;if(R=="svg"?o="http://www.w3.org/2000/svg":R=="math"?o="http://www.w3.org/1998/Math/MathML":o||(o="http://www.w3.org/1999/xhtml"),t!=null){for(e=0;e<t.length;e++)if(($=t[e])&&"setAttribute"in $==!!R&&(R?$.localName==R:$.nodeType==3)){n=$,t[e]=null;break}}if(n==null){if(R==null)return document.createTextNode(k);n=document.createElementNS(o,R,k.is&&k),_&&(Z.__m&&Z.__m(r,t),_=!1),t=null}if(R==null)w===k||_&&n.data==k||(n.data=k);else{if(t=t&&vr.call(n.childNodes),!_&&t!=null)for(w={},e=0;e<n.attributes.length;e++)w[($=n.attributes[e]).name]=$.value;for(e in w)$=w[e],e=="dangerouslySetInnerHTML"?f=$:e=="children"||(e in k)||e=="value"&&("defaultValue"in k)||e=="checked"&&("defaultChecked"in k)||pr(n,e,null,$,o);for(e in k)$=k[e],e=="children"?y=$:e=="dangerouslySetInnerHTML"?x=$:e=="value"?v=$:e=="checked"?W=$:_&&typeof $!="function"||w[e]===$||pr(n,e,$,w[e],o);if(x)_||f&&(x.__html==f.__html||x.__html==n.innerHTML)||(n.innerHTML=x.__html),r.__k=[];else if(f&&(n.innerHTML=""),yc(r.type=="template"?n.content:n,kr(y)?y:[y],r,i,c,R=="foreignObject"?"http://www.w3.org/1999/xhtml":o,t,s,t?t[0]:i.__k&&Pn(i,0),_,l),t!=null)for(e=t.length;e--;)ar(t[e]);_||(e="value",R=="progress"&&v==null?n.removeAttribute("value"):v!=null&&(v!==n[e]||R=="progress"&&!v||R=="option"&&v!=w[e])&&pr(n,e,v,w[e],o),e="checked",W!=null&&W!=n[e]&&pr(n,e,W,w[e],o))}return n}function ri(n,r,i){try{if(typeof n=="function"){var c=typeof n.__u=="function";c&&n.__u(),c&&r==null||(n.__u=n(r))}else n.current=r}catch(o){Z.__e(o,i)}}function kc(n,r,i){var c,o;if(Z.unmount&&Z.unmount(n),(c=n.ref)&&(c.current&&c.current!=n.__e||ri(c,null,r)),(c=n.__c)!=null){if(c.componentWillUnmount)try{c.componentWillUnmount()}catch(t){Z.__e(t,r)}c.base=c.__P=null}if(c=n.__k)for(o=0;o<c.length;o++)c[o]&&kc(c[o],r,i||typeof n.type!="function");i||ar(n.__e),n.__c=n.__=n.__e=void 0}function Kt(n,r,i){return this.constructor(n,i)}function An(n,r,i){var c,o,t,s;r==document&&(r=document.documentElement),Z.__&&Z.__(n,r),o=(c=typeof i=="function")?null:i&&i.__k||r.__k,t=[],s=[],ni(r,n=(!c&&i||r).__k=mr(dr,null,[n]),o||yr,yr,r.namespaceURI,!c&&i?[i]:o?null:r.firstChild?vr.call(r.childNodes):null,t,!c&&i?i:o?o.__e:r.firstChild,c,s),bc(t,n,s)}function Wt(n){function r(i){var c,o;return this.getChildContext||(c=new Set,(o={})[r.__c]=this,this.getChildContext=function(){return o},this.componentWillUnmount=function(){c=null},this.shouldComponentUpdate=function(t){this.props.value!=t.value&&c.forEach(function(s){s.__e=!0,Or(s)})},this.sub=function(t){c.add(t);var s=t.componentWillUnmount;t.componentWillUnmount=function(){c&&c.delete(t),s&&s.call(t)}}),i.children}return r.__c="__cC"+hc++,r.__=n,r.Provider=r.__l=(r.Consumer=function(i,c){return i.children(c)}).contextType=r,r}function Xn(n,r){J.__h&&J.__h(I,n,Vn||r),Vn=0;var i=I.__H||(I.__H={__:[],__h:[]});return n>=i.__.length&&i.__.push({}),i.__[n]}function p(n){return Vn=1,Bc(Tc,n)}function Bc(n,r,i){var c=Xn(vn++,2);if(c.t=n,!c.__c&&(c.__=[i?i(r):Tc(void 0,r),function(_){var l=c.__N?c.__N[0]:c.__[0],e=c.t(l,_);l!==e&&(c.__N=[e,c.__[1]],c.__c.setState({}))}],c.__c=I,!I.__f)){var o=function(_,l,e){if(!c.__c.__H)return!0;var x=c.__c.__H.__.filter(function(y){return y.__c});if(x.every(function(y){return!y.__N}))return!t||t.call(this,_,l,e);var f=c.__c.props!==_;return x.some(function(y){if(y.__N){var $=y.__[0];y.__=y.__N,y.__N=void 0,$!==y.__[0]&&(f=!0)}}),t&&t.call(this,_,l,e)||f};I.__f=!0;var{shouldComponentUpdate:t,componentWillUpdate:s}=I;I.componentWillUpdate=function(_,l,e){if(this.__e){var x=t;t=void 0,o(_,l,e),t=x}s&&s.call(this,_,l,e)},I.shouldComponentUpdate=o}return c.__N||c.__}function P(n,r){var i=Xn(vn++,3);!J.__s&&ii(i.__H,r)&&(i.__=n,i.u=r,I.__H.__h.push(i))}function Br(n,r){var i=Xn(vn++,4);!J.__s&&ii(i.__H,r)&&(i.__=n,i.u=r,I.__h.push(i))}function Q(n){return Vn=5,X(function(){return{current:n}},[])}function Mt(n,r,i){Vn=6,Br(function(){if(typeof n=="function"){var c=n(r());return function(){n(null),c&&typeof c=="function"&&c()}}if(n)return n.current=r(),function(){return n.current=null}},i==null?i:i.concat(n))}function X(n,r){var i=Xn(vn++,7);return ii(i.__H,r)&&(i.__=n(),i.__H=r,i.__h=n),i.__}function z(n,r){return Vn=8,X(function(){return n},r)}function Nt(n){var r=I.context[n.__c],i=Xn(vn++,9);return i.c=n,r?(i.__==null&&(i.__=!0,r.sub(I)),r.props.value):n.__}function Rt(n,r){J.useDebugValue&&J.useDebugValue(r?r(n):n)}function jt(n){var r=Xn(vn++,10),i=p();return r.__=n,I.componentDidCatch||(I.componentDidCatch=function(c,o){r.__&&r.__(c,o),i[1](c)}),[i[0],function(){i[1](void 0)}]}function Ut(){for(var n;n=dc.shift();){var r=n.__H;if(n.__P&&r)try{r.__h.some(wr),r.__h.some(Er),r.__h=[]}catch(i){r.__h=[],J.__e(i,n.__v)}}}function Ht(n){var r,i=function(){clearTimeout(c),lc&&cancelAnimationFrame(r),setTimeout(n)},c=setTimeout(i,35);lc&&(r=requestAnimationFrame(i))}function wr(n){var r=I,i=n.__c;typeof i=="function"&&(n.__c=void 0,i()),I=r}function Er(n){var r=I;n.__c=n.__(),I=r}function ii(n,r){return!n||n.length!==r.length||r.some(function(i,c){return i!==n[c]})}function Tc(n,r){return typeof r=="function"?r(n):r}function Lt(n){var r=fc.get(this);return r||(r=new Map,fc.set(this,r)),(r=Fc(this,r.get(n)||(r.set(n,r=function(i){for(var c,o,t=1,s="",_="",l=[0],e=function(y){t===1&&(y||(s=s.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?l.push(0,y,s):t===3&&(y||s)?(l.push(3,y,s),t=2):t===2&&s==="..."&&y?l.push(4,y,0):t===2&&s&&!y?l.push(5,0,!0,s):t>=5&&((s||!y&&t===5)&&(l.push(t,0,s,o),t=6),y&&(l.push(t,y,0,o),t=6)),s=""},x=0;x<i.length;x++){x&&(t===1&&e(),e(x));for(var f=0;f<i[x].length;f++)c=i[x][f],t===1?c==="<"?(e(),l=[l],t=3):s+=c:t===4?s==="--"&&c===">"?(t=1,s=""):s=c+s[0]:_?c===_?_="":s+=c:c==='"'||c==="'"?_=c:c===">"?(e(),t=1):t&&(c==="="?(t=5,o=s,s=""):c==="/"&&(t<5||i[x][f+1]===">")?(e(),t===3&&(l=l[0]),t=l,(l=l[0]).push(2,0,t),t=0):c===" "||c==="\t"||c===`
`||c==="\r"?(e(),t=2):s+=c),t===3&&s==="!--"&&(t=4,l=l[0])}return e(),l}(n)),r),arguments,[])).length>1?r:r[0]}var vr,Z,ec,kt,bn,mi,gc,pc,Dr,$r,an,$c,Sr,Zr,Yr,hc,yr,xr,dt,kr,vn,I,Ir,ic,Vn=0,dc,J,cc,oc,tc,sc,uc,_c,lc,Fc=function(n,r,i,c){var o;r[0]=0;for(var t=1;t<r.length;t++){var s=r[t++],_=r[t]?(r[0]|=s?1:2,i[r[t++]]):r[++t];s===3?c[0]=_:s===4?c[1]=Object.assign(c[1]||{},_):s===5?(c[1]=c[1]||{})[r[++t]]=_:s===6?c[1][r[++t]]+=_+"":s?(o=n.apply(_,Fc(n,_,i,["",null])),c.push(o),_[0]?r[0]|=2:(r[t-2]=0,r[t]=o)):c.push(_)}return c},fc,u;var E=C(()=>{yr={},xr=[],dt=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,kr=Array.isArray;vr=xr.slice,Z={__e:function(n,r,i,c){for(var o,t,s;r=r.__;)if((o=r.__c)&&!o.__)try{if((t=o.constructor)&&t.getDerivedStateFromError!=null&&(o.setState(t.getDerivedStateFromError(n)),s=o.__d),o.componentDidCatch!=null&&(o.componentDidCatch(n,c||{}),s=o.__d),s)return o.__E=o}catch(_){n=_}throw n}},ec=0,kt=function(n){return n!=null&&n.constructor===void 0},mn.prototype.setState=function(n,r){var i;i=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=en({},this.state),typeof n=="function"&&(n=n(en({},i),this.props)),n&&en(i,n),n!=null&&this.__v&&(r&&this._sb.push(r),Or(this))},mn.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),Or(this))},mn.prototype.render=dr,bn=[],gc=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,pc=function(n,r){return n.__v.__b-r.__v.__b},br.__r=0,Dr=Math.random().toString(8),$r="__d"+Dr,an="__a"+Dr,$c=/(PointerCapture)$|Capture$/i,Sr=0,Zr=rc(!1),Yr=rc(!0),hc=0;dc=[],J=Z,cc=J.__b,oc=J.__r,tc=J.diffed,sc=J.__c,uc=J.unmount,_c=J.__;J.__b=function(n){I=null,cc&&cc(n)},J.__=function(n,r){n&&r.__k&&r.__k.__m&&(n.__m=r.__k.__m),_c&&_c(n,r)},J.__r=function(n){oc&&oc(n),vn=0;var r=(I=n.__c).__H;r&&(Ir===I?(r.__h=[],I.__h=[],r.__.some(function(i){i.__N&&(i.__=i.__N),i.u=i.__N=void 0})):(r.__h.some(wr),r.__h.some(Er),r.__h=[],vn=0)),Ir=I},J.diffed=function(n){tc&&tc(n);var r=n.__c;r&&r.__H&&(r.__H.__h.length&&(dc.push(r)!==1&&ic===J.requestAnimationFrame||((ic=J.requestAnimationFrame)||Ht)(Ut)),r.__H.__.some(function(i){i.u&&(i.__H=i.u),i.u=void 0})),Ir=I=null},J.__c=function(n,r){r.some(function(i){try{i.__h.some(wr),i.__h=i.__h.filter(function(c){return!c.__||Er(c)})}catch(c){r.some(function(o){o.__h&&(o.__h=[])}),r=[],J.__e(c,i.__v)}}),sc&&sc(n,r)},J.unmount=function(n){uc&&uc(n);var r,i=n.__c;i&&i.__H&&(i.__H.__.some(function(c){try{wr(c)}catch(o){r=o}}),i.__H=void 0,r&&J.__e(r,i.__v))};lc=typeof requestAnimationFrame=="function";fc=new Map;u=Lt.bind(mr)});function zc({children:n,className:r=""}){let[i,c]=p(null);return P(()=>{if(typeof document>"u")return;let o=document.createElement("div");return o.className=r||"",document.body.appendChild(o),c(o),()=>{try{An(null,o)}finally{o.remove()}}},[]),P(()=>{if(!i)return;i.className=r||"";return},[r,i]),Br(()=>{if(!i)return;An(n,i);return},[n,i]),null}var Kc=C(()=>{E()});function ci(n,r){let i=String(n.label||"").localeCompare(String(r.label||""),void 0,{sensitivity:"base"});if(i!==0)return i;return String(n.id||"").localeCompare(String(r.id||""),void 0,{sensitivity:"base"})}function kn(n){let r=zn.findIndex((i)=>i.id===n.id);if(r>=0)zn[r]=n;else zn.push(n);zn.sort(ci)}function sl(n){let r=zn.findIndex((i)=>i.id===n);if(r>=0)zn.splice(r,1)}function Wc(){return[...zn]}function ul(){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent("piclaw:settings-panes-changed"))}var zn;var Qn=C(()=>{zn=[]});function Tr(n){let r=typeof n==="string"?n.trim():"";return r?r:null}function Mc(n={}){if(typeof window>"u")return;let r=Tr(n.section);try{if(window.__piclawSettingsOpenRequested=!0,r)window.__piclawSettingsRequestedSection=r;else delete window.__piclawSettingsRequestedSection}catch(i){console.debug("[settings-dialog-events] failed to record open request flags",i)}window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:r?{section:r}:void 0}))}function oi(){if(typeof window>"u")return null;return Tr(window.__piclawSettingsRequestedSection)}function Nc(){if(typeof window>"u")return{open:!1,section:null};let n=Boolean(window.__piclawSettingsOpenRequested),r=oi();try{window.__piclawSettingsOpenRequested=!1,delete window.__piclawSettingsRequestedSection}catch(i){console.debug("[settings-dialog-events] failed to clear open request flags",i)}return{open:n,section:r}}function jc(n=typeof window<"u"?window:null){return n||null}function Fr(){if(typeof performance<"u"&&typeof performance.now==="function")return performance.now();return Date.now()}function cr(n,r){return`${n}:${r}`}function Uc(n){return`${n}-${Math.random().toString(36).slice(2,10)}-${Date.now().toString(36)}`}function Hc(n,r){if(n.length<=r)return;n.splice(0,n.length-r)}function Kn(n){if(!n||typeof n!=="object")return null;return{...n}}function Nn(n){if(!n)return null;return Wn.find((r)=>r.id===n)||null}function ti(n,r){if(typeof performance>"u"||typeof performance.mark!=="function")return;try{performance.mark(`piclaw:${n}:${r}`)}catch(i){console.debug("[app-perf] Ignoring performance.mark failure.",i,{traceId:n,phase:r})}}function Lc(n){if(typeof performance>"u"||typeof performance.clearMarks!=="function")return;try{performance.clearMarks(`piclaw:${n}:start`);let r=Nn(n);if(!r)return;for(let i of r.phases)performance.clearMarks(`piclaw:${n}:${i.phase}`)}catch(r){console.debug("[app-perf] Ignoring performance.clearMarks failure.",r,{traceId:n})}}function Rc(n,r,i){let c=Mn.get(cr(n,r));if(c&&Nn(c)?.status==="active")ir(c,"cancelled","superseded",{replacementType:n,replacementChatJid:r});let o=Uc(n),t={id:o,type:n,chatJid:r,startedAt:Fr(),detail:Kn(i),phases:[],status:"active"};return Wn.push(t),Hc(Wn,100),Mn.set(cr(n,r),o),ti(o,"start"),o}function ir(n,r,i,c,o){let t=Nn(n);if(!t||t.status!=="active")return;if(i)t.phases.push({phase:i,at:Fr(),detail:Kn(c)}),ti(t.id,i);if(t.status=r,t.completedAt=Fr(),t.durationMs=t.completedAt-t.startedAt,o!==void 0)t.error=o instanceof Error?o.message:String(o);let s=cr(t.type,t.chatJid);if(Mn.get(s)===t.id)Mn.delete(s);Lc(t.id)}function Pt(n=jc()){let r=n?.__PICLAW_PERF__;if(r)return r;if(n)n.__PICLAW_PERF__=zr;return zr}function Cn(n=jc()){return Pt(n)}function fl(n,r,i){return Cn().ensureTrace(n,r,i)}function el(n,r){return Cn().getActiveTraceId(n,r)}function gl(n,r,i){Cn().markTrace(n,r,i)}function pl(n,r,i="settled",c){let o=Nn(n);if(!o||o.status!=="active")return!1;let t=new Set(o.phases.map((s)=>s.phase));if(!r.every((s)=>t.has(s)))return!1;return ir(n,"completed",i,c),!0}function $l(n,r,i="failed",c){Cn().failTrace(n,r,i,c)}function hl(n,r="cancelled",i){Cn().cancelTrace(n,r,i)}function si(n){return Cn().recordRequest(n)}var Wn,rr,Mn,zr;var Gc=C(()=>{Wn=[],rr=[],Mn=new Map;zr={startTrace(n,r,i){return Rc(n,r,i)},ensureTrace(n,r,i){let c=Mn.get(cr(n,r));if(c&&Nn(c)?.status==="active")return c;return Rc(n,r,i)},getActiveTraceId(n,r){let i=Mn.get(cr(n,r));return i&&Nn(i)?.status==="active"?i:null},markTrace(n,r,i){let c=Nn(n);if(!c||c.status!=="active")return;c.phases.push({phase:r,at:Fr(),detail:Kn(i)}),ti(c.id,r)},completeTrace(n,r="settled",i){ir(n,"completed",r,i)},failTrace(n,r,i="failed",c){ir(n,"failed",i,c,r)},cancelTrace(n,r="cancelled",i){ir(n,"cancelled",r,i)},recordRequest(n){let r=Uc("req");return rr.push({...n,id:r,detail:Kn(n.detail)}),Hc(rr,300),r},getTraces(){return Wn.map((n)=>({...n,detail:Kn(n.detail),phases:n.phases.map((r)=>({...r,detail:Kn(r.detail)}))}))},getRequests(){return rr.map((n)=>({...n,detail:Kn(n.detail)}))},clear(){Wn.forEach((n)=>Lc(n.id)),Wn.splice(0,Wn.length),rr.splice(0,rr.length),Mn.clear()},printSummary(){let n={traces:zr.getTraces(),requests:zr.getRequests()};return console.table(n.traces.map((r)=>({id:r.id,type:r.type,chatJid:r.chatJid,status:r.status,durationMs:Number(r.durationMs||0).toFixed(1),lastPhase:r.phases[r.phases.length-1]?.phase||"start"}))),n}}});function qn(n){let r=Number(n||0);return Number.isFinite(r)&&r>0?r:null}function Vt(n){try{return Boolean(n?.matchMedia?.("(pointer: coarse)")?.matches)}catch{return!1}}function At(n){let r=String(n?.navigator?.userAgent||"");return/Android|webOS|iPhone|iPod|Mobile|Windows Phone/i.test(r)}function Pc(n){let r=String(n?.navigator?.userAgent||"");return/iPad|Tablet|PlayBook|Silk/i.test(r)}function Vc(n=typeof window<"u"?window:null){let r=qn(n?.innerWidth)??qn(n?.screen?.availWidth)??qn(n?.screen?.width)??0,i=qn(n?.innerHeight)??qn(n?.screen?.availHeight)??qn(n?.screen?.height)??0,c=r&&i?Math.min(r,i):r||i,o=r&&i?Math.max(r,i):r||i,t=Vt(n),s=Number(n?.navigator?.maxTouchPoints||0),_=t||s>1;if(c>0&&c<=640)return"mobile";if(At(n)&&!Pc(n))return"mobile";if(Pc(n))return"tablet";if(_&&c>0&&c<=1100)return"tablet";if(o>0&&o<=1180&&c>0&&c<=900)return"tablet";return"desktop"}var ms={};nn(ms,{uploadWorkspaceFile:()=>Is,uploadMedia:()=>vs,updateWorkspaceFile:()=>Vs,updateScheduledTask:()=>li,submitAdaptiveCardAction:()=>ds,streamSidePrompt:()=>Bs,stopSessionRecording:()=>gi,stopAutoresearch:()=>ps,steerAgentQueueItem:()=>ys,startSessionRecording:()=>ei,setWorkspaceVisibility:()=>Es,setAgentThoughtVisibility:()=>zs,sessionRecordingPlaybackUrl:()=>$i,sessionRecordingExportUrl:()=>or,sendPeerAgentMessage:()=>ts,sendAgentMessage:()=>gn,searchPosts:()=>qt,saveWorkspaceSettings:()=>vi,saveWebPushSubscription:()=>us,saveUiState:()=>wi,saveQuickActionsSettings:()=>bi,saveEnvironmentOverride:()=>Wr,restoreChatBranch:()=>os,respondToAgentRequest:()=>ks,reorderAgentQueueItem:()=>xs,renameWorkspaceFile:()=>Ys,renameChatJid:()=>cs,renameChatBranch:()=>mt,removeAgentQueueItem:()=>ws,reindexWorkspace:()=>Ls,purgeChatBranch:()=>is,pruneChatBranch:()=>rs,previewSessionRecordingRedaction:()=>hi,moveWorkspaceEntry:()=>Os,mergeChatBranchIntoParent:()=>ns,getWorkspaceTree:()=>js,getWorkspaceRawUrl:()=>Xc,getWorkspaceIndexStatus:()=>Hs,getWorkspaceFileStat:()=>Ps,getWorkspaceFileDownloadUrl:()=>Ss,getWorkspaceFile:()=>Gs,getWorkspaceDownloadUrl:()=>as,getWorkspaceBranch:()=>Us,getWebPushPublicKey:()=>ss,getTimeline:()=>Qt,getThumbnailUrl:()=>Ws,getThread:()=>Dt,getSystemMetrics:()=>It,getSessionRecordings:()=>fi,getSessionRecording:()=>Kr,getScheduledTasks:()=>_i,getQuickActionsSettings:()=>xi,getPostsByHashtag:()=>Ct,getMediaUrl:()=>Ks,getMediaText:()=>Ns,getMediaInfo:()=>Ms,getMediaBlob:()=>Rs,getEnvironmentSettings:()=>ki,getChatBranches:()=>Et,getAutoresearchStatus:()=>gs,getAgents:()=>ls,getAgentThought:()=>Fs,getAgentStatus:()=>fs,getAgentQueueState:()=>hs,getAgentModels:()=>di,getAgentContext:()=>es,getAgentCommands:()=>yi,getActiveChatAgents:()=>Jt,forkChatBranch:()=>St,dismissAutoresearch:()=>$s,deleteWorkspaceFile:()=>Js,deleteWebPushSubscription:()=>_s,deleteSessionRecording:()=>pi,deletePost:()=>Ot,createWorkspaceFile:()=>Zs,createRootChatSession:()=>at,createReply:()=>Yt,createPost:()=>Zt,completeInstanceOobe:()=>bs,attachWorkspaceFile:()=>As,addToWhitelist:()=>Ts,SSEClient:()=>Qc});async function L(n,r={}){let i=typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now(),c;try{c=await fetch(a+n,{...r,headers:{"Content-Type":"application/json",...r.headers}})}catch(t){throw si({method:String(r.method||"GET").toUpperCase(),url:n,startedAt:i,durationMs:(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-i,ok:!1,detail:{failedBeforeResponse:!0}}),t}let o=(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-i;if(si({method:String(r.method||"GET").toUpperCase(),url:n,startedAt:i,durationMs:o,status:c.status,ok:c.ok,requestId:c.headers?.get?.("x-request-id")||null,serverTiming:c.headers?.get?.("Server-Timing")||null}),!c.ok){let t=await c.json().catch(()=>({error:"Unknown error"}));throw Error(t.error||`HTTP ${c.status}`)}return c.json()}function Ac(n){let r=String(n||"").split(`
`),i="message",c=[];for(let t of r)if(t.startsWith("event:"))i=t.slice(6).trim()||"message";else if(t.startsWith("data:"))c.push(t.slice(5).trim());let o=c.join(`
`);if(!o)return null;try{return{event:i,data:JSON.parse(o)}}catch{return{event:i,data:o}}}async function Xt(n,r){if(!n.body)throw Error("Missing event stream body");let i=n.body.getReader(),c=new TextDecoder,o="";while(!0){let{value:s,done:_}=await i.read();if(_)break;o+=c.decode(s,{stream:!0});let l=o.split(`

`);o=l.pop()||"";for(let e of l){let x=Ac(e);if(x)r(x.event,x.data)}}o+=c.decode();let t=Ac(o);if(t)r(t.event,t.data)}async function Qt(n=10,r=null,i=null){let c=`/timeline?limit=${n}`;if(r)c+=`&before=${r}`;if(i)c+=`&chat_jid=${encodeURIComponent(i)}`;return L(c)}async function Ct(n,r=50,i=0,c=null){let o=c?`&chat_jid=${encodeURIComponent(c)}`:"";return L(`/hashtag/${encodeURIComponent(n)}?limit=${r}&offset=${i}${o}`)}async function qt(n,r=50,i=0,c=null,o="current",t=null,s=null){let _=c?`&chat_jid=${encodeURIComponent(c)}`:"",l=o?`&scope=${encodeURIComponent(o)}`:"",e=t?`&root_chat_jid=${encodeURIComponent(t)}`:"",x=s?.images?"&images=1":"",f=s?.attachments?"&attachments=1":"";return L(`/search?q=${encodeURIComponent(n)}&limit=${r}&offset=${i}${_}${l}${e}${x}${f}`)}async function Dt(n,r=null){let i=r?`?chat_jid=${encodeURIComponent(r)}`:"";return L(`/thread/${n}${i}`)}async function It(){return L("/agent/system-metrics")}async function _i(n={}){let r=new URLSearchParams;if(n?.id)r.set("id",String(n.id));if(n?.chatJid)r.set("chat_jid",String(n.chatJid));if(n?.status&&n.status!=="all")r.set("status",String(n.status));if(n?.limit)r.set("limit",String(n.limit));if(n?.includeRunLogs)r.set("include_run_logs","1");if(n?.runLogLimit)r.set("run_log_limit",String(n.runLogLimit));let i=r.toString()?`?${r.toString()}`:"";return L(`/agent/scheduled-tasks${i}`)}async function li(n,r,i={}){return L("/agent/scheduled-tasks/action",{method:"POST",body:JSON.stringify({action:n,id:r,allow_internal:i?.allowInternal===!0})})}async function fi(){return L("/agent/recordings")}async function Kr(n){return L(`/agent/recordings/${encodeURIComponent(n)}`)}async function ei(n={}){return L("/agent/recordings/start",{method:"POST",body:JSON.stringify(n||{})})}async function gi(n={}){return L("/agent/recordings/stop",{method:"POST",body:JSON.stringify(n||{})})}async function pi(n){return L(`/agent/recordings/${encodeURIComponent(n)}`,{method:"DELETE"})}function or(n,r="json"){return`/agent/recordings/${encodeURIComponent(n)}/export?format=${encodeURIComponent(r)}`}function $i(n){return`/recordings/playback?id=${encodeURIComponent(n)}`}async function hi(n,r={}){return L("/agent/recordings/redact-preview",{method:"POST",body:JSON.stringify({payload:n,...r})})}async function wi(n){return L("/agent/ui-state",{method:"POST",body:JSON.stringify(n||{})})}async function Zt(n,r=[],i=null){let c=i?`?chat_jid=${encodeURIComponent(i)}`:"";return L(`/post${c}`,{method:"POST",body:JSON.stringify({content:n,media_ids:r})})}async function Yt(n,r,i=[],c=null){let o=c?`?chat_jid=${encodeURIComponent(c)}`:"";return L(`/post/reply${o}`,{method:"POST",body:JSON.stringify({thread_id:n,content:r,media_ids:i})})}async function Ot(n,r=!1,i=null){let c=i?`&chat_jid=${encodeURIComponent(i)}`:"",o=`/post/${n}?cascade=${r?"true":"false"}${c}`;return L(o,{method:"DELETE"})}async function gn(n,r,i=null,c=[],o=null,t=null){let s=t?`?chat_jid=${encodeURIComponent(t)}`:"",_={content:r,thread_id:i,media_ids:c,client_context:{screen_hint:Vc()}};if(o==="auto"||o==="queue"||o==="steer")_.mode=o;return L(`/agent/${n}/message${s}`,{method:"POST",body:JSON.stringify(_)})}async function yi(n="web:default"){let r=typeof n==="string"&&n.trim()?n.trim():"web:default";return L(`/agent/commands?chat_jid=${encodeURIComponent(r)}`)}async function xi(){return L("/agent/settings/quick-actions")}async function bi(n){return L("/agent/settings/quick-actions",{method:"POST",body:JSON.stringify(n||{})})}async function vi(n){return L("/agent/settings/workspace",{method:"POST",body:JSON.stringify(n||{})})}async function ki(){return L("/agent/settings/environment")}async function Wr(n){return L("/agent/settings/environment",{method:"POST",body:JSON.stringify(n||{})})}async function Jt(){return L("/agent/active-chats")}async function Et(n=null,r={}){let i=new URLSearchParams;if(n)i.set("root_chat_jid",String(n));if(r?.includeArchived)i.set("include_archived","1");let c=i.toString()?`?${i.toString()}`:"";return L(`/agent/branches${c}`)}async function St(n,r={}){return L("/agent/branch-fork",{method:"POST",body:JSON.stringify({source_chat_jid:n,...r?.agentName?{agent_name:r.agentName}:{}})})}async function at(n){return L("/agent/root-session",{method:"POST",body:JSON.stringify({agent_name:n})})}async function mt(n,r={}){return L("/agent/branch-rename",{method:"POST",body:JSON.stringify({chat_jid:n,...r&&Object.prototype.hasOwnProperty.call(r,"agentName")?{agent_name:r.agentName}:{}})})}async function ns(n){return L("/agent/branch-merge-parent",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function rs(n){return L("/agent/branch-prune",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function is(n){return L("/agent/branch-purge",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function cs(n,r){return L("/agent/rename-jid",{method:"POST",body:JSON.stringify({old_jid:n,new_jid:r})})}async function os(n,r={}){return L("/agent/branch-restore",{method:"POST",body:JSON.stringify({chat_jid:n,...r&&Object.prototype.hasOwnProperty.call(r,"agentName")?{agent_name:r.agentName}:{}})})}async function ts(n,r,i,c="auto",o={}){let t={source_chat_jid:n,content:i,mode:c,...o?.sourceAgentName?{source_agent_name:o.sourceAgentName}:{},...o?.targetBy==="agent_name"?{target_agent_name:r}:{target_chat_jid:r}};return L("/agent/peer-message",{method:"POST",body:JSON.stringify(t)})}async function ss(){return L("/agent/push/vapid-public-key")}async function us(n,r={}){let i={subscription:n,...r?.deviceId?{device_id:r.deviceId}:{}};return L("/agent/push/subscription",{method:"POST",body:JSON.stringify(i)})}async function _s(n,r={}){let i={subscription:n,...r?.deviceId?{device_id:r.deviceId}:{}};return L("/agent/push/subscription",{method:"DELETE",body:JSON.stringify(i)})}async function ls(){return L("/agent/roster")}async function fs(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return L(`/agent/status${r}`)}async function es(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return L(`/agent/context${r}`)}async function gs(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return L(`/agent/autoresearch/status${r}`)}async function ps(n=null,r={}){return L("/agent/autoresearch/stop",{method:"POST",body:JSON.stringify({chat_jid:n||void 0,generate_report:r?.generateReport!==!1})})}async function $s(n=null){return L("/agent/autoresearch/dismiss",{method:"POST",body:JSON.stringify({chat_jid:n||void 0})})}async function hs(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return L(`/agent/queue-state${r}`)}async function ws(n,r=null){let i=await fetch(a+"/agent/queue-remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:n,chat_jid:r||void 0})});if(!i.ok){let c=await i.json().catch(()=>({error:"Failed to remove queued item"}));throw Error(c.error||`HTTP ${i.status}`)}return i.json()}async function ys(n,r=null){let i=await fetch(a+"/agent/queue-steer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:n,chat_jid:r||void 0})});if(!i.ok){let c=await i.json().catch(()=>({error:"Failed to steer queued item"}));throw Error(c.error||`HTTP ${i.status}`)}return i.json()}async function xs(n,r,i=null){let c=await fetch(a+"/agent/queue-reorder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from_index:n,to_index:r,chat_jid:i||void 0})});if(!c.ok){let o=await c.json().catch(()=>({error:"Failed to reorder queued item"}));throw Error(o.error||`HTTP ${c.status}`)}return c.json()}async function di(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return L(`/agent/models${r}`)}async function bs(n="provider-ready"){return L("/agent/oobe/complete",{method:"POST",body:JSON.stringify({kind:n})})}async function vs(n){let r=new FormData;r.append("file",n);let i=await fetch(a+"/media/upload",{method:"POST",body:r});if(!i.ok){let c=await i.json().catch(()=>({error:"Upload failed"}));throw Error(c.error||`HTTP ${i.status}`)}return i.json()}async function ks(n,r,i=null){let c=await fetch(a+"/agent/respond",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id:n,outcome:r,chat_jid:i||void 0})});if(!c.ok){let o=await c.json().catch(()=>({error:"Failed to respond"}));throw Error(o.error||`HTTP ${c.status}`)}return c.json()}async function ds(n){let r=await fetch(a+"/agent/card-action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!r.ok){let i=await r.json().catch(()=>({error:"Adaptive Card action failed"}));throw Error(i.error||`HTTP ${r.status}`)}return r.json()}async function Bs(n,r={}){let i=await fetch(a+"/agent/side-prompt/stream",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:n,system_prompt:r.systemPrompt||void 0,chat_jid:r.chatJid||void 0}),signal:r.signal});if(!i.ok){let t=await i.json().catch(()=>({error:"Side prompt failed"}));throw Error(t.error||`HTTP ${i.status}`)}let c=null,o=null;if(await Xt(i,(t,s)=>{if(r.onEvent?.(t,s),t==="side_prompt_thinking_delta")r.onThinkingDelta?.(s?.delta||"");else if(t==="side_prompt_text_delta")r.onTextDelta?.(s?.delta||"");else if(t==="side_prompt_done")c=s;else if(t==="side_prompt_error")o=s}),o){let t=Error(o?.error||"Side prompt failed");throw t.payload=o,t}return c}async function Ts(n,r){let i=await fetch(a+"/agent/whitelist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pattern:n,description:r})});if(!i.ok){let c=await i.json().catch(()=>({error:"Failed to add to whitelist"}));throw Error(c.error||`HTTP ${i.status}`)}return i.json()}async function Fs(n,r="thought"){let i=`/agent/thought?turn_id=${encodeURIComponent(n)}&panel=${encodeURIComponent(r)}`;return L(i)}async function zs(n,r,i){return L("/agent/thought/visibility",{method:"POST",body:JSON.stringify({turn_id:n,panel:r,expanded:Boolean(i)})})}function Ks(n){return`${a}/media/${n}`}function Ws(n){return`${a}/media/${n}/thumbnail`}async function Ms(n){let r=await fetch(`${a}/media/${n}/info`);if(!r.ok)throw Error("Failed to get media info");return r.json()}async function Ns(n){let r=await fetch(`${a}/media/${n}`);if(!r.ok)throw Error("Failed to load media text");return r.text()}async function Rs(n){let r=await fetch(`${a}/media/${n}`);if(!r.ok)throw Error("Failed to load media blob");return r.blob()}async function js(n="",r=2,i=!1){let c=`/workspace/tree?path=${encodeURIComponent(n)}&depth=${r}&show_hidden=${i?"1":"0"}`;return L(c)}async function Us(n=""){let r=`/workspace/branch?path=${encodeURIComponent(n||"")}`;return L(r)}async function Hs(n="all"){let r=`/workspace/index-status?scope=${encodeURIComponent(n||"all")}`;return L(r)}async function Ls(n="all"){return L("/workspace/reindex",{method:"POST",body:JSON.stringify({scope:n})})}async function Gs(n,r=20000,i=null){let c=i?`&mode=${encodeURIComponent(i)}`:"",o=`/workspace/file?path=${encodeURIComponent(n)}&max=${r}${c}`;return L(o)}async function Ps(n){return L(`/workspace/stat?path=${encodeURIComponent(n)}`)}async function Vs(n,r){return L("/workspace/file",{method:"PUT",body:JSON.stringify({path:n,content:r})})}async function As(n){return L("/workspace/attach",{method:"POST",body:JSON.stringify({path:n})})}function Qs(n,r="",i={}){let c=new URLSearchParams;if(r)c.set("path",r);if(i.overwrite)c.set("overwrite","1");let o=c.toString();return o?`${n}?${o}`:n}function Cs(){if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();return`upload-${Date.now()}-${Math.random().toString(36).slice(2)}`}function qs(n,r,i,c){return new Promise((o,t)=>{let s=new XMLHttpRequest;s.open("POST",a+r);for(let[_,l]of Object.entries(i||{}))if(l!==void 0&&l!==null)s.setRequestHeader(_,String(l));s.upload.onprogress=(_)=>{if(typeof c==="function")c({loaded:_.lengthComputable?_.loaded:0,total:_.lengthComputable?_.total:n.size,lengthComputable:_.lengthComputable})},s.onload=()=>{try{let _=s.responseText?JSON.parse(s.responseText):{};if(s.status>=200&&s.status<300)o(_);else{let l=Error(_.error||`HTTP ${s.status}`);l.status=s.status,l.code=_.code,t(l)}}catch{let _=Error(`HTTP ${s.status}`);_.status=s.status,t(_)}},s.onerror=()=>t(Error("Upload failed (network error)")),s.ontimeout=()=>t(Error("Upload timed out")),s.send(n)})}async function Ds(n,r="",i={}){let c=Cs(),o=Qs("/workspace/upload-chunk",r,i),t=Math.max(1,Math.min(ui,Number(i.chunkSize)||Xs)),s=Math.max(0,Number(n?.size)||0),_=Math.max(1,Math.ceil(s/t)),l=0,e=null;for(let x=0;x<_;x+=1){let f=x*t,y=Math.min(s,f+t),$=n.slice(f,y),v=$.size;if(e=await qs($,o,{"X-Upload-Id":c,"X-Chunk-Index":x,"X-Chunk-Total":_,"X-File-Name":n?.name||"upload.bin","X-File-Size":s},(W)=>{if(typeof i.onProgress!=="function")return;let w=Math.min(s,l+(W?.loaded||0)),k=s||1;i.onProgress({loaded:w,total:k,percent:Math.round(w/k*100),chunkIndex:x,chunkTotal:_})}),l+=v,typeof i.onProgress==="function"){let W=s||1,w=s?l:W;i.onProgress({loaded:w,total:W,percent:Math.round(w/W*100),chunkIndex:x+1,chunkTotal:_})}}return e}async function Is(n,r="",i={}){if(n?.size>ui){let c=(n.size/1048576).toFixed(0),o=(ui/1048576).toFixed(0),t=Error(`File too large (${c} MB). Maximum upload size is ${o} MB.`);throw t.code="file_too_large",t}return await Ds(n,r,i)}async function Zs(n,r,i=""){let c=await fetch(a+"/workspace/file",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,name:r,content:i})});if(!c.ok){let o=await c.json().catch(()=>({error:"Create failed"})),t=Error(o.error||`HTTP ${c.status}`);throw t.status=c.status,t.code=o.code,t}return c.json()}async function Ys(n,r){let i=await fetch(a+"/workspace/rename",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,name:r})});if(!i.ok){let c=await i.json().catch(()=>({error:"Rename failed"})),o=Error(c.error||`HTTP ${i.status}`);throw o.status=i.status,o.code=c.code,o}return i.json()}async function Os(n,r){let i=await fetch(a+"/workspace/move",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,target:r})});if(!i.ok){let c=await i.json().catch(()=>({error:"Move failed"})),o=Error(c.error||`HTTP ${i.status}`);throw o.status=i.status,o.code=c.code,o}return i.json()}async function Js(n){let r=`/workspace/file?path=${encodeURIComponent(n||"")}`;return L(r,{method:"DELETE"})}async function Es(n,r=!1){return L("/workspace/visibility",{method:"POST",body:JSON.stringify({visible:Boolean(n),show_hidden:Boolean(r)})})}function Xc(n,r={}){let i=new URLSearchParams({path:String(n||"")});if(r.download)i.set("download","1");return`${a}/workspace/raw?${i.toString()}`}function Ss(n){return Xc(n,{download:!0})}function as(n,r=!1){let i=`path=${encodeURIComponent(n||"")}&show_hidden=${r?"1":"0"}`;return`${a}/workspace/download?${i}`}class Qc{onEvent;onStatusChange;chatJid;eventSource;reconnectTimeout;reconnectDelay;status;reconnectAttempts;cooldownUntil;connecting;lastActivityAt;staleCheckTimer;staleThresholdMs;constructor(n,r,i={}){this.onEvent=n,this.onStatusChange=r,this.chatJid=typeof i?.chatJid==="string"&&i.chatJid.trim()?i.chatJid.trim():null,this.eventSource=null,this.reconnectTimeout=null,this.reconnectDelay=1000,this.status="disconnected",this.reconnectAttempts=0,this.cooldownUntil=0,this.connecting=!1,this.lastActivityAt=0,this.staleCheckTimer=null,this.staleThresholdMs=70000}markActivity(){this.lastActivityAt=Date.now()}clearStaleMonitor(){if(this.staleCheckTimer)clearInterval(this.staleCheckTimer),this.staleCheckTimer=null}startStaleMonitor(){this.clearStaleMonitor(),this.staleCheckTimer=setInterval(()=>{if(this.status!=="connected")return;if(!this.lastActivityAt)return;if(Date.now()-this.lastActivityAt<=this.staleThresholdMs)return;console.warn("SSE connection went stale; forcing reconnect"),this.forceReconnect()},15000)}forceReconnect(){if(this.connecting=!1,this.eventSource)this.eventSource.close(),this.eventSource=null;this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()}connect(){if(this.connecting)return;if(this.eventSource&&this.status==="connected")return;if(this.connecting=!0,this.eventSource)this.eventSource.close();this.clearStaleMonitor();let n=this.chatJid?`?chat_jid=${encodeURIComponent(this.chatJid)}`:"";this.eventSource=new EventSource(a+"/sse/stream"+n);let r=(i)=>{this.eventSource.addEventListener(i,(c)=>{this.markActivity(),this.onEvent(i,JSON.parse(c.data))})};this.eventSource.onopen=()=>{this.connecting=!1,this.reconnectDelay=1000,this.reconnectAttempts=0,this.cooldownUntil=0,this.status="connected",this.markActivity(),this.startStaleMonitor(),this.onStatusChange("connected")},this.eventSource.onerror=()=>{this.connecting=!1,this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()},this.eventSource.addEventListener("connected",()=>{this.markActivity(),console.log("SSE connected"),this.onEvent("connected",{})}),this.eventSource.addEventListener("heartbeat",()=>{this.markActivity()}),r("new_post"),r("new_reply"),r("agent_response"),r("interaction_updated"),r("interaction_deleted"),r("agent_status"),r("agent_steer_queued"),r("agent_followup_queued"),r("agent_followup_consumed"),r("agent_followup_removed"),r("workspace_update"),r("agent_draft"),r("agent_draft_delta"),r("agent_thought"),r("agent_thought_delta"),r("model_changed"),r("ui_theme"),r("ui_meters"),["extension_ui_request","extension_ui_timeout","extension_ui_notify","extension_ui_status","extension_ui_working","extension_ui_working_indicator","extension_ui_working_visible","extension_ui_widget","extension_ui_title","extension_ui_editor_text","extension_ui_error"].forEach(r)}scheduleReconnect(){if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout);let n=10,r=60000,i=Date.now();if(this.reconnectAttempts>=n)this.cooldownUntil=Math.max(this.cooldownUntil,i+r),this.reconnectAttempts=0;let c=Math.max(this.cooldownUntil-i,0),o=Math.max(this.reconnectDelay,c);this.reconnectTimeout=setTimeout(()=>{console.log("Reconnecting SSE..."),this.connect()},o),this.reconnectDelay=Math.min(this.reconnectDelay*2,30000)}reconnectIfNeeded(){let n=Date.now();if(this.status==="connected"){if(this.lastActivityAt&&n-this.lastActivityAt>this.staleThresholdMs)this.forceReconnect();return}if(this.cooldownUntil&&n<this.cooldownUntil)return;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null;this.connect()}disconnect(){if(this.connecting=!1,this.clearStaleMonitor(),this.eventSource)this.eventSource.close(),this.eventSource=null;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null}}var a="",ui=1073741824,Xs=8388608;var pn=C(()=>{Gc()});function Dn(n){if(typeof window>"u"||!window.localStorage)return null;try{return window.localStorage.getItem(n)}catch{return null}}function on(n,r){if(typeof window>"u"||!window.localStorage)return;try{window.localStorage.setItem(n,r)}catch{return}}function Bi(n,r=!1){let i=Dn(n);if(i===null)return r;return i==="true"}function Ti(n,r=null){let i=Dn(n);if(i===null)return r;let c=parseInt(i,10);return Number.isFinite(c)?c:r}function Cc(n){let r=Dn(n);if(!r)return null;try{return JSON.parse(r)}catch{return null}}function ru(n){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(Nr,{detail:{enabled:Boolean(n)}}))}function Ic(n){if(typeof fetch!=="function")return;wi({ui_meters:n}).catch((r)=>{console.debug("[meters] Failed to persist meters UI state.",r)})}function iu(n){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(nu,{detail:{collapsed:Boolean(n)}}))}function Fi(n=!1){return Bi(qc,n)}function Bl(n=!1){return Bi(Dc,n)}function Mr(n,r={}){let i=r.persist!==!1,c=r.persistServer!==!1,o=Boolean(n);if(i)on(qc,o?"true":"false");if(c)Ic({enabled:o});return ru(o),o}function cu(n,r={}){let i=r.persist!==!1,c=r.persistServer!==!1,o=Boolean(n);if(i)on(Dc,o?"true":"false");if(c)Ic({collapsed:o});return iu(o),o}function Tl(n){let r=typeof n?.mode==="string"?n.mode.trim().toLowerCase():"";if(typeof n?.enabled==="boolean")Mr(Boolean(n.enabled),{persistServer:!1});else if(r==="toggle"){let i=!Fi(!1);Mr(i,{persistServer:!1})}if(typeof n?.collapsed==="boolean")cu(Boolean(n.collapsed),{persistServer:!1})}var qc="piclaw_system_meters_enabled",Dc="piclaw_system_meters_collapsed",Nr="piclaw-meters-change",nu="piclaw-meters-collapsed-change";var Zc=C(()=>{pn()});function Yc(n,r){if(n===""||n===null||n===void 0)return r;let i=Number(n);return Number.isFinite(i)?i:r}function Oc(n,{min:r=-1/0,max:i=1/0}={}){let c=Number.isFinite(Number(r))?Number(r):-1/0,o=Number.isFinite(Number(i))?Number(i):1/0;return Math.min(o,Math.max(c,Number(n)))}function $n(n,{fallback:r=0,min:i=-1/0,max:c=1/0}={}){let o=Yc(n,r);return Oc(o,{min:i,max:c})}function ou(n,{direction:r=1,step:i=1,fallback:c=0,min:o=-1/0,max:t=1/0}={}){let s=$n(n,{fallback:c,min:o,max:t}),_=Math.abs(Yc(i,1))||1,l=Number(r)<0?-1:1;return Oc(s+l*_,{min:o,max:t})}function S({value:n,min:r,max:i,step:c=1,fallback:o,width:t="80px",disabled:s=!1,label:_,onChange:l}){let e=Number.isFinite(Number(o))?Number(o):$n(n,{fallback:0,min:r,max:i}),[x,f]=p(String(n??e)),y=Q(!1);P(()=>{if(!y.current)f(String(n??e))},[n,e]);let $=z((W)=>{y.current=!1;let w=$n(W,{fallback:e,min:r,max:i});f(String(w)),l?.(w)},[e,r,i,l]),v=z((W)=>{y.current=!1;let w=ou(n,{direction:W,step:c,fallback:e,min:r,max:i});f(String(w)),l?.(w)},[e,i,r,l,c,n]);return u`
        <span class="settings-number-stepper">
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Decrease ${_||"value"}`}
                title=${`Decrease ${_||"value"}`}
                disabled=${s}
                onClick=${()=>v(-1)}
            >−</button>
            <input
                class="settings-number-input"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                value=${x}
                disabled=${s}
                style=${`width:${t}`}
                onInput=${(W)=>{y.current=!0,f(W.target.value)}}
                onBlur=${(W)=>$(W.target.value)}
                onKeyDown=${(W)=>{if(W.key==="Enter")W.preventDefault(),$(W.target.value),W.target.blur()}}
            />
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Increase ${_||"value"}`}
                title=${`Increase ${_||"value"}`}
                disabled=${s}
                onClick=${()=>v(1)}
            >+</button>
        </span>
    `}var Rn=C(()=>{E()});function Jc(n){let r=String(n||"").trim();if(!r)return"";if(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("data:")||r.startsWith("blob:"))return r;if(r.startsWith("/workspace/"))return`/workspace/file?path=${encodeURIComponent(r.slice(11))}`;if(r.startsWith("/"))return"";if(/^[a-zA-Z]:[\\/]/.test(r))return"";if(r.startsWith("\\\\"))return"";if(r.includes("\\"))return"";return`/workspace/file?path=${encodeURIComponent(r.replace(/^\.\//,""))}`}function Ec({value:n,onChange:r}){let i=Q(null),[c,o]=p(Jc(n));P(()=>{o(Jc(n))},[n]);let t=z((s)=>{let _=s.target.files?.[0];if(!_)return;let l=new FileReader;l.onload=()=>{let e=l.result;o(e),r?.(e)},l.readAsDataURL(_)},[r]);return u`
        <div class="settings-avatar-inline" onClick=${()=>i.current?.click()} title="Click to upload">
            ${c?u`<img src=${c} alt="avatar" />`:u`<span class="settings-avatar-placeholder">+</span>`}
            <input type="file" accept="image/*" ref=${i} style="display:none" onChange=${t} />
        </div>
    `}function Sc(n={}){return{userName:n.userName||"",userAvatar:n.userAvatar||"",assistantName:n.assistantName||"",assistantAvatar:n.assistantAvatar||"",composeUploadLimitMb:n.composeUploadLimitMb??32,workspaceUploadLimitMb:n.workspaceUploadLimitMb??256}}async function tu(n,r={}){let i=typeof n==="string"?n:"";if(!i)return!1;let c=r.navigator??(typeof navigator<"u"?navigator:null),o=r.document??(typeof document<"u"?document:null);if(c?.clipboard?.writeText)try{return await c.clipboard.writeText(i),!0}catch(t){}try{if(!o?.body||typeof o.createElement!=="function"||typeof o.execCommand!=="function")return!1;let t=o.createElement("textarea");t.value=i,t.setAttribute?.("readonly",""),t.style.position="fixed",t.style.left="-9999px",t.style.top="0",t.style.opacity="0",o.body.appendChild(t),t.focus?.(),t.select?.();let s=Boolean(o.execCommand("copy"));return o.body.removeChild(t),s}catch(t){return!1}}function zi({settingsData:n,setStatus:r,mergeSettingsData:i}){let[c,o]=p(""),[t,s]=p(""),[_,l]=p(""),[e,x]=p(""),[f,y]=p(32),[$,v]=p(256),[W,w]=p(""),[k,R]=p(!1),[j,d]=p(!1),[M,h]=p(!1),[T,G]=p(()=>Fi(!1)),[g,K]=p(!1),H=Q(""),b=Q(null),B=Q(!0);P(()=>{return B.current=!0,()=>{B.current=!1}},[]);let N=z((D)=>{let q=Sc(D);o(q.userName),s(q.userAvatar),l(q.assistantName),x(q.assistantAvatar),y(q.composeUploadLimitMb),v(q.workspaceUploadLimitMb),w(D?.widgetToken||""),H.current=JSON.stringify(q)},[]);P(()=>{N(n||{})},[n,N]),P(()=>{let D=(q)=>{G(Boolean(q?.detail?.enabled))};return window.addEventListener(Nr,D),()=>window.removeEventListener(Nr,D)},[]);let A=X(()=>JSON.stringify(Sc({userName:c,userAvatar:t,assistantName:_,assistantAvatar:e,composeUploadLimitMb:f,workspaceUploadLimitMb:$})),[c,t,_,e,f,$]);P(()=>{if(A===H.current)return;if(b.current)clearTimeout(b.current);return b.current=setTimeout(async()=>{if(!B.current)return;let D=document.activeElement;if(D&&D.closest?.(".settings-number-stepper"))return;try{let q=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:A}),Tn=await q.json().catch(()=>({}));if(!B.current)return;if(!q.ok||!Tn?.ok||!Tn?.settings)return;H.current=A,i?.(Tn.settings),K(!0),setTimeout(()=>{if(B.current)K(!1)},4000)}catch(q){console.warn("[settings/general] Failed to persist general settings snapshot.",q)}},800),()=>{if(b.current)clearTimeout(b.current)}},[A,i]);let Y=n?.instanceTotp||{configured:!1,issuer:_||"Piclaw",label:c?`${_||"Piclaw"}:${c}`:_||"Piclaw",secret:"",otpauth:"",qrSvg:""},yn=z(async()=>{if(!W)return;if(await tu(W))d(!0),setTimeout(()=>{if(B.current)d(!1)},3000);else r?.("Could not copy widget token. Select the token field and copy manually."),console.warn("[settings/general] Failed to copy widget token. Clipboard APIs unavailable or blocked.")},[W,r]),cn=z(async()=>{if(M)return;if(!confirm("Regenerate the widget token? Existing macOS widgets using the old token will stop updating."))return;h(!0);try{let D=await fetch("/agent/settings/widget-token/regenerate",{method:"POST"}),q=await D.json().catch(()=>({}));if(!D.ok||!q?.ok||!q?.settings)throw Error(q?.error||"Failed to regenerate widget token.");w(q.settings.widgetToken||""),i?.(q.settings),K(!0),setTimeout(()=>{if(B.current)K(!1)},4000)}catch(D){console.warn("[settings/general] Failed to regenerate widget token.",D)}finally{if(B.current)h(!1)}},[M,i]),Bn=typeof window<"u"&&window.isSecureContext,Ln=W?"•".repeat(Math.min(Math.max(W.length,16),48)):"—",Gn=k?W||"—":Ln;return u`
        <div class="settings-section">
            ${g&&u`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Identity</h3>
            <div class="settings-row">
                <label>User</label>
                <${Ec} value=${t} onChange=${s} />
                <input type="text" value=${c} onInput=${(D)=>o(D.target.value)} placeholder="Your name" />
            </div>
            <div class="settings-row">
                <label>Agent</label>
                <${Ec} value=${e} onChange=${x} />
                <input type="text" value=${_} onInput=${(D)=>l(D.target.value)} placeholder="Agent name" />
            </div>

            <h3 style="margin-top:20px">Notifications</h3>
            ${Bn?u`
                <div class="settings-row">
                    <label>Browser notifications</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="settings-hint" style="margin:0">
                            Use the 🔔 bell button in the compose bar to enable/disable notifications.
                            Web Push requires HTTPS or localhost.
                        </span>
                    </div>
                </div>
            `:u`
                <div class="settings-row">
                    <label>Browser notifications</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="settings-hint" style="margin:0; color: var(--error-color, #e55)">
                            ⚠ Not available — requires a secure context (HTTPS or localhost).
                            Access via SSH tunnel or reverse proxy with TLS to enable.
                        </span>
                    </div>
                </div>
            `}

            <h3 style="margin-top:20px">Display</h3>
            <div class="settings-row">
                <label>System meters</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${T}
                        onChange=${()=>{let D=Mr(!T);G(D)}} />
                    <span class="settings-hint" style="margin:0">CPU/memory/network meters in the status bar. This browser only.</span>
                </div>
            </div>

            <h3 style="margin-top:20px">Instance Configuration</h3>
            <div class="settings-row">
                <label>Compose upload (MB)</label>
                <${S}
                    label="compose upload limit"
                    value=${f}
                    min=${1}
                    max=${512}
                    fallback=${32}
                    width="80px"
                    onChange=${y}
                />
                <span class="settings-hint" style="margin:0">chat/media attachments</span>
            </div>
            <div class="settings-row">
                <label>Workspace upload (MB)</label>
                <${S}
                    label="workspace upload limit"
                    value=${$}
                    min=${1}
                    max=${1024}
                    fallback=${256}
                    width="80px"
                    onChange=${v}
                />
                <span class="settings-hint" style="margin:0">defaults to 256 MB; chunked uploads allow up to 1 GB</span>
            </div>

            <h3 style="margin-top:20px">Authentication</h3>
            <div class="settings-row settings-row-vertical settings-widget-token-row">
                <label>Widget bearer token</label>
                <div class="settings-keychain-reveal-panel settings-widget-token-panel">
                    <div class="settings-keychain-reveal-field settings-widget-token-field">
                        <span class="settings-keychain-reveal-label">Token</span>
                        <code class="settings-keychain-reveal-value settings-widget-token-value">${Gn}</code>
                        <button class=${`settings-keychain-reveal-btn${k?" active":""}`}
                            type="button"
                            onClick=${()=>R((D)=>!D)}
                            disabled=${!W}
                            title=${k?"Hide token":"Reveal token"}>
                            ${k?u`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:u`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                        </button>
                        <button class="settings-keychain-copy-btn" type="button" onClick=${yn} disabled=${!W} title="Copy token">
                            ${j?u`<span class="settings-widget-token-copied">Copied</span>`:u`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`}
                        </button>
                        <button class="settings-keychain-prompt-submit settings-widget-token-regenerate" type="button" onClick=${cn} disabled=${M}>${M?"Regenerating…":"Regenerate"}</button>
                    </div>
                </div>
                <span class="settings-hint" style="margin:6px 0 0 0;">
                    Read-only token for <code>GET /api/state</code> and <code>GET /api/state/events</code>. Use as <code>Authorization: Bearer …</code>.
                </span>
            </div>
            <div class="settings-totp-panel">
                <div class="settings-totp-header">
                    <div>
                        <strong>TOTP setup QR</strong>
                        <div class="settings-hint" style="margin:6px 0 0 0;">
                            ${Y.configured?"Current web-login authenticator secret. Scan this QR to add another authenticator device.":"TOTP is not configured for this instance yet, so no setup QR is available."}
                        </div>
                    </div>
                </div>
                ${Y.configured?u`
                    <div class="settings-totp-grid">
                        <div class="settings-totp-qr" dangerouslySetInnerHTML=${{__html:Y.qrSvg}}></div>
                        <div class="settings-totp-meta">
                            <div class="settings-row settings-row-vertical">
                                <label>Issuer</label>
                                <input type="text" readonly value=${Y.issuer||""} />
                            </div>
                            <div class="settings-row settings-row-vertical">
                                <label>Label</label>
                                <input type="text" readonly value=${Y.label||""} />
                            </div>
                            <div class="settings-row settings-row-vertical">
                                <label>Secret</label>
                                <input type="text" readonly value=${Y.secret||""} />
                            </div>
                        </div>
                    </div>
                `:null}
            </div>
        </div>
    `}var ac=C(()=>{E();Zc();Rn()});var no={};nn(no,{SessionsSection:()=>su});function mc(n={}){return{sessionAutoRotate:n.sessionAutoRotate!==!1,sessionMaxSizeMb:n.sessionMaxSizeMb??16,sessionMaxLines:n.sessionMaxLines??4000,sessionMaxCompactions:n.sessionMaxCompactions??3,sessionIsolation:n.sessionIsolation||"none",toolUseBudget:n.toolUseBudget??64}}function su({settingsData:n,setStatus:r,mergeSettingsData:i}){let[c,o]=p(!0),[t,s]=p(16),[_,l]=p(4000),[e,x]=p(3),[f,y]=p(64),[$,v]=p("none"),[W,w]=p(!1),k=Q(""),R=Q(null),j=Q(!0);P(()=>{return j.current=!0,()=>{j.current=!1}},[]);let d=z((h)=>{let T=mc(h);o(T.sessionAutoRotate),s(T.sessionMaxSizeMb),l(T.sessionMaxLines),x(T.sessionMaxCompactions),y(T.toolUseBudget),v(T.sessionIsolation),k.current=JSON.stringify(T)},[]);P(()=>{d(n||{})},[n,d]);let M=X(()=>JSON.stringify(mc({sessionAutoRotate:c,sessionMaxSizeMb:t,sessionMaxLines:_,sessionMaxCompactions:e,toolUseBudget:f,sessionIsolation:$})),[c,t,_,e,f,$]);return P(()=>{if(M===k.current)return;if(R.current)clearTimeout(R.current);return R.current=setTimeout(async()=>{if(!j.current)return;let h=document.activeElement;if(h&&h.closest?.(".settings-number-stepper"))return;try{let T=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:M}),G=await T.json().catch(()=>({}));if(!j.current)return;if(!T.ok||!G?.ok||!G?.settings)return;k.current=M,i?.(G.settings),w(!0),setTimeout(()=>{if(j.current)w(!1)},4000)}catch(T){console.warn("[settings/sessions] Failed to persist session settings.",T)}},800),()=>{if(R.current)clearTimeout(R.current)}},[M,i]),u`
        <div class="settings-section">
            ${W&&u`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Session Lifecycle</h3>
            <div class="settings-row">
                <label>Auto-rotate sessions</label>
                <input type="checkbox" checked=${c} onChange=${(h)=>o(h.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Max session size (MB)</label>
                <${S}
                    label="max session size"
                    value=${t}
                    min=${1}
                    max=${256}
                    fallback=${32}
                    width="80px"
                    onChange=${s}
                />
            </div>

            <h3 style="margin-top:20px">Agent Behaviour</h3>
            <div class="settings-row">
                <label>Tool use budget</label>
                <${S}
                    label="tool use budget"
                    value=${f}
                    min=${8}
                    max=${512}
                    fallback=${64}
                    width="80px"
                    onChange=${y}
                />
                <span class="settings-hint" style="margin:0">max tool-call messages per turn</span>
            </div>
            <div class="settings-row">
                <label>Session isolation</label>
                <select value=${$} onChange=${(h)=>v(h.target.value)}>
                    <option value="none">None — full cross-session visibility</option>
                    <option value="summary">Summary — tools visible, no arguments</option>
                    <option value="full">Full — sessions cannot see each other</option>
                </select>
            </div>
        </div>
    `}var ro=C(()=>{E();Rn()});var io={};nn(io,{__recordingsSettingsTest:()=>fu,RecordingsSection:()=>lu});function jr(n){if(!n)return"—";let r=new Date(n);if(Number.isNaN(r.getTime()))return n;return r.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Ki(n){if(n==="full")return"full / trusted";if(n==="metadata")return"metadata only";return"redacted"}function Rr({children:n,type:r="neutral"}){return u`<span class=${`settings-task-pill settings-task-pill-${r}`}>${n}</span>`}function uu(){if(typeof window>"u")return"web:default";return String(window.__piclawCurrentChatJid||"web:default")}function tr(n){return String(n||"").split(`
`).map((r)=>r.trim()).filter(Boolean)}function _u({recording:n,details:r,onDelete:i,onRefresh:c}){if(!n)return u`<div class="settings-task-detail-empty">Select a recording to inspect, replay, export, or delete it.</div>`;let o=r?.meta||n,t=Array.isArray(r?.events)?r.events:[],s=t.reduce((l,e)=>l+(Array.isArray(e.redactions)?e.redactions.length:0),0),_=t.reduce((l,e)=>{let x=e.kind||"event";return l[x]=(l[x]||0)+1,l},{});return u`
        <div class="settings-task-detail settings-recording-detail">
            <div class="settings-task-detail-header">
                <div>
                    <h4>${o.title||o.id}</h4>
                    <code>${o.id}</code>
                </div>
                <div class="settings-task-detail-actions">
                    <button onClick=${()=>window.open($i(o.id),"_blank","noopener,noreferrer")}>Playback</button>
                    <button onClick=${c}>Refresh</button>
                    <button class="danger" onClick=${()=>i(o)}>Delete</button>
                </div>
            </div>
            <div class="settings-task-detail-grid">
                <span>Status</span><strong>${o.status||"—"}</strong>
                <span>Mode</span><strong>${Ki(o.mode)}</strong>
                <span>Chat</span><code>${o.chatJid||"—"}</code>
                <span>Started</span><strong>${jr(o.startedAt)}</strong>
                <span>Ended</span><strong>${jr(o.endedAt)}</strong>
                <span>Events</span><strong>${o.eventCount??t.length}</strong>
                <span>Redactions</span><strong>${s}</strong>
            </div>
            <div class="settings-recording-export-row">
                <a href=${or(o.id,"json")}>Export JSON</a>
                <a href=${or(o.id,"jsonl")}>Export JSONL</a>
                <a href=${or(o.id,"html")}>Export standalone HTML</a>
            </div>
            <h4>Event summary</h4>
            ${t.length===0&&u`<p class="settings-hint">Open or refresh details to inspect trace events.</p>`}
            ${t.length>0&&u`
                <div class="settings-recording-event-summary">
                    ${Object.entries(_).map(([l,e])=>u`<${Rr}>${l}: ${e}<//>`)}
                </div>
                <div class="settings-task-command-block">
                    <strong>First events</strong>
                    <pre>${JSON.stringify(t.slice(0,5),null,2)}</pre>
                </div>
            `}
        </div>
    `}function lu({filter:n="",setStatus:r}){let[i,c]=p([]),[o,t]=p([]),[s,_]=p(!0),[l,e]=p(null),[x,f]=p(null),[y,$]=p(null),[v,W]=p(!1),[w,k]=p(uu),[R,j]=p(""),[d,M]=p("redacted"),[h,T]=p(!0),[G,g]=p(""),[K,H]=p(""),[b,B]=p('{"Authorization":"Bearer abc1234567890","content":"hello"}'),[N,A]=p(null);P(()=>{let U=(O)=>{let rn=String(O?.detail?.chatJid||"").trim();if(rn)k(rn)};return window.addEventListener("piclaw:current-chat-changed",U),()=>window.removeEventListener("piclaw:current-chat-changed",U)},[]);let Y=z(async(U=x)=>{_(!0),e(null);try{let O=await fi(),rn=O.recordings||[];c(rn),t(O.active||[]);let xn=rn.find((F)=>F.id===U)||rn[0]||null;if(f(xn?.id||null),xn?.id)$(await Kr(xn.id));else $(null)}catch(O){e(O?.message||"Failed to load recordings.")}finally{_(!1)}},[x]);P(()=>{Y()},[Y]);let yn=X(()=>i.find((U)=>U.id===x)||null,[i,x]),cn=X(()=>o.find((U)=>U.chatJid===w)||null,[o,w]),Bn=String(n||"").trim().toLowerCase(),Ln=X(()=>{if(!Bn)return i;return i.filter((U)=>[U.id,U.title,U.chatJid,U.status,U.mode].some((O)=>String(O||"").toLowerCase().includes(Bn)))},[i,Bn]),Gn=z(async(U)=>{if(f(U?.id||null),$(null),!U?.id)return;try{$(await Kr(U.id))}catch(O){r?.(O?.message||"Failed to load recording.","error")}},[r]),D=z(async()=>{if(v)return;W(!0);try{let U={keys:tr(G),patterns:tr(K)},O=await ei({chat_jid:w,title:R||void 0,mode:d,include_timeline_snapshot:h,timeline_snapshot_limit:80,redaction:U});r?.(`Recording started for ${w}.`,"success"),await Y(O?.recording?.id)}catch(U){r?.(U?.message||"Failed to start recording.","error")}finally{W(!1)}},[v,w,G,K,h,Y,d,r,R]),q=z(async(U=cn)=>{if(!U||v)return;W(!0);try{let O=await gi({id:U.id});r?.(`Recording stopped for ${U.chatJid}.`,"success"),await Y(O?.recording?.id)}catch(O){r?.(O?.message||"Failed to stop recording.","error")}finally{W(!1)}},[v,cn,Y,r]),Tn=z(async(U)=>{if(!U||v)return;if(!window.confirm(`Delete recording ${U.id}?

${U.title||""}`))return;W(!0);try{await pi(U.id),r?.("Recording deleted.","success"),await Y(null)}catch(O){r?.(O?.message||"Failed to delete recording.","error")}finally{W(!1)}},[v,Y,r]),er=z(async()=>{try{let U=JSON.parse(b||"null"),O=await hi(U,{mode:d,redaction:{keys:tr(G),patterns:tr(K)}});A(O.preview)}catch(U){A({error:U?.message||"Preview failed."})}},[G,K,d,b]);return u`
        <div class="settings-section settings-recordings-section">
            <div class="settings-recording-start-card">
                <h3>Session Recording</h3>
                <p class="settings-hint">Opt-in trace capture for deterministic playback and screen-recording exports. Playback never calls live agent or tool endpoints.</p>
                <div class="settings-recording-form-grid">
                    <label>Chat JID<input value=${w} onInput=${(U)=>k(U.target.value)} /></label>
                    <label>Title<input placeholder="Demo recording" value=${R} onInput=${(U)=>j(U.target.value)} /></label>
                    <label>Mode<select value=${d} onChange=${(U)=>M(U.target.value)}><option value="redacted">Redacted</option><option value="metadata">Metadata only</option><option value="full">Full / trusted local</option></select></label>
                    <label class="settings-recording-checkbox"><input type="checkbox" checked=${h} onChange=${(U)=>T(U.target.checked)} /> Include timeline snapshot</label>
                </div>
                <div class="settings-recording-form-grid settings-recording-redaction-grid">
                    <label>Extra redacted keys<textarea rows="2" placeholder="customer_id\ninternal_code" value=${G} onInput=${(U)=>g(U.target.value)} /></label>
                    <label>Extra regex patterns<textarea rows="2" placeholder="ACME-[0-9]+" value=${K} onInput=${(U)=>H(U.target.value)} /></label>
                </div>
                <div class="settings-task-detail-actions">
                    ${cn?u`<button onClick=${()=>q(cn)} disabled=${v}>Stop current chat recording</button>`:u`<button onClick=${D} disabled=${v}>Start recording</button>`}
                    <button onClick=${()=>Y()} disabled=${s}>Refresh</button>
                </div>
                ${o.length>0&&u`<div class="settings-recording-active-row">${o.map((U)=>u`<${Rr} type="active">REC ${U.chatJid}<//>`)}</div>`}
            </div>

            <details class="settings-recording-preview">
                <summary>Redaction preview</summary>
                <textarea rows="4" value=${b} onInput=${(U)=>B(U.target.value)} />
                <div class="settings-task-detail-actions"><button onClick=${er}>Preview redaction</button></div>
                ${N&&u`<pre>${JSON.stringify(N,null,2)}</pre>`}
            </details>

            ${s&&u`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading recordings…</span></div>`}
            ${l&&u`<div class="settings-error-state">${l}</div>`}
            ${!s&&!l&&i.length===0&&u`<div class="settings-empty-state"><strong>No recordings yet.</strong><p>Start a recording above, then use playback/export for deterministic screen capture.</p></div>`}
            ${!s&&!l&&i.length>0&&u`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Session recordings">
                        ${Ln.map((U)=>u`
                            <button class=${`settings-task-row ${U.id===x?"active":""}`} onClick=${()=>Gn(U)}>
                                <span class="settings-task-row-main"><strong>${U.title||U.id}</strong><span>${U.chatJid} · ${jr(U.startedAt)}</span></span>
                                <span class="settings-task-row-meta"><${Rr} type=${U.status==="recording"?"active":"completed"}>${U.status}<//><${Rr}>${Ki(U.mode)}<//></span>
                                <span class="settings-task-row-times">${U.eventCount||0} events</span>
                            </button>
                        `)}
                        ${Ln.length===0&&u`<p class="settings-hint">No recordings match “${n}”.</p>`}
                    </div>
                    <${_u} recording=${yn} details=${y} onDelete=${Tn} onRefresh=${()=>yn&&Gn(yn)} />
                </div>
            `}
        </div>
    `}var fu;var co=C(()=>{E();pn();fu={formatDateTime:jr,modeLabel:Ki,parseList:tr}});var oo={};nn(oo,{CompactionSection:()=>gu});function eu(n={}){return{compactionTimeoutSec:n.compactionTimeoutSec??180,compactionBackoffBaseMin:n.compactionBackoffBaseMin??15,compactionBackoffMaxMin:n.compactionBackoffMaxMin??360,compactionThresholdPercent:n.compactionThresholdPercent??75,compactionBackoffDecayFactor:n.compactionBackoffDecayFactor??0.5,progressWatchdogEnabled:Boolean(n.progressWatchdogEnabled??!1),progressWatchdogTimeoutSec:n.progressWatchdogTimeoutSec??120,compactionBackoffs:Array.isArray(n.compactionBackoffs)?n.compactionBackoffs:[],progressWatchdogPhases:Array.isArray(n.progressWatchdogPhases)?n.progressWatchdogPhases:[]}}function Wi(n){let r=String(n||"").trim();if(!r)return"—";let i=new Date(r);if(Number.isNaN(i.getTime()))return r;return i.toLocaleString()}function gu({settingsData:n,setStatus:r,mergeSettingsData:i}){let[c,o]=p(180),[t,s]=p(15),[_,l]=p(360),[e,x]=p(75),[f,y]=p(0.5),[$,v]=p(!1),[W,w]=p(120),[k,R]=p([]),[j,d]=p([]),[M,h]=p(!1),T=Q(""),G=Q(null),g=Q(!0);P(()=>{return g.current=!0,()=>{g.current=!1}},[]);let K=z((B)=>{let N=eu(B);o(N.compactionTimeoutSec),s(N.compactionBackoffBaseMin),l(N.compactionBackoffMaxMin),x(N.compactionThresholdPercent),y(N.compactionBackoffDecayFactor),v(N.progressWatchdogEnabled),w(N.progressWatchdogTimeoutSec),R(N.compactionBackoffs),d(N.progressWatchdogPhases),T.current=JSON.stringify({compactionTimeoutSec:N.compactionTimeoutSec,compactionBackoffBaseMin:N.compactionBackoffBaseMin,compactionBackoffMaxMin:N.compactionBackoffMaxMin,compactionThresholdPercent:N.compactionThresholdPercent,compactionBackoffDecayFactor:N.compactionBackoffDecayFactor,progressWatchdogEnabled:N.progressWatchdogEnabled,progressWatchdogTimeoutSec:N.progressWatchdogTimeoutSec})},[]);P(()=>{K(n||{})},[n,K]);let H=X(()=>JSON.stringify({compactionTimeoutSec:c,compactionBackoffBaseMin:t,compactionBackoffMaxMin:_,compactionThresholdPercent:e,compactionBackoffDecayFactor:f,progressWatchdogEnabled:$,progressWatchdogTimeoutSec:W}),[c,t,_,e,f,$,W]);P(()=>{if(H===T.current)return;if(G.current)clearTimeout(G.current);return G.current=setTimeout(async()=>{if(!g.current)return;let B=document.activeElement;if(B&&B.closest?.(".settings-number-stepper"))return;try{r?.("Saving compaction settings…","info");let N=await fetch("/agent/settings/compaction",{method:"POST",headers:{"Content-Type":"application/json"},body:H}),A=await N.json().catch(()=>({}));if(!g.current)return;if(!N.ok||!A?.ok||!A?.settings){r?.(A?.error||"Failed to save compaction settings.","error");return}T.current=H,i?.(A.settings),K({...n||{},...A.settings||{}}),r?.("Compaction settings saved.","success"),h(!0),setTimeout(()=>{if(g.current)h(!1),r?.(null)},4000)}catch(N){if(console.warn("[settings/compaction] Failed to persist compaction settings.",N),g.current)r?.("Failed to save compaction settings.","error")}},800),()=>{if(G.current)clearTimeout(G.current)}},[H,i,r,K,n]);let b=z(async(B)=>{try{r?.(`Clearing compaction suppression for ${B}…`,"info");let N=await fetch("/agent/settings/compaction/reset-backoff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatJid:B})}),A=await N.json().catch(()=>({}));if(!N.ok||!A?.ok||!A?.settings){r?.(A?.error||"Failed to clear compaction suppression.","error");return}i?.(A.settings),K({...n||{},...A.settings||{}}),r?.(`Cleared compaction suppression for ${B}.`,"success")}catch(N){console.warn("[settings/compaction] Failed to clear compaction suppression.",N),r?.("Failed to clear compaction suppression.","error")}},[K,i,r,n]);return u`
        <div class="settings-section">
            ${M&&u`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Compaction settings applied. Existing turns keep their current timers; new turns use the updated values.
                </div>
            `}

            <h3>Automatic compaction</h3>
            <div class="settings-row">
                <label>Compaction threshold (%)</label>
                <${S}
                    label="compaction threshold"
                    value=${e}
                    min=${10}
                    max=${95}
                    fallback=${75}
                    width="80px"
                    onChange=${x}
                />
                <span class="settings-hint" style="margin:0">auto-compact when context exceeds this % of window</span>
            </div>
            <div class="settings-row">
                <label>Compaction timeout (sec)</label>
                <${S}
                    label="compaction timeout"
                    value=${c}
                    min=${1}
                    max=${3600}
                    fallback=${180}
                    width="90px"
                    onChange=${o}
                />
                <span class="settings-hint" style="margin:0">Abort a stuck pre-prompt/manual compaction instead of hanging forever.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff base (min)</label>
                <${S}
                    label="compaction backoff base"
                    value=${t}
                    min=${1}
                    max=${1440}
                    fallback=${15}
                    width="90px"
                    onChange=${s}
                />
                <span class="settings-hint" style="margin:0">First suppression window after a compaction failure.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff max (min)</label>
                <${S}
                    label="compaction backoff max"
                    value=${_}
                    min=${1}
                    max=${10080}
                    fallback=${360}
                    width="90px"
                    onChange=${l}
                />
                <span class="settings-hint" style="margin:0">Upper bound for exponential suppression after repeated failures.</span>
            </div>

            <div class="settings-row">
                <label>Backoff decay factor</label>
                <${S}
                    label="backoff decay factor"
                    value=${Math.round(f*100)}
                    min=${10}
                    max=${100}
                    fallback=${50}
                    width="80px"
                    onChange=${(B)=>y(B/100)}
                />
                <span class="settings-hint" style="margin:0">% — halves backoff after each successful compaction</span>
            </div>

            <h3 style="margin-top:20px">Stall watchdog</h3>
            <div class="settings-row">
                <label>Enable watchdog</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${$} onChange=${(B)=>v(Boolean(B.target.checked))} />
                    <span class="settings-hint" style="margin:0">Disabled by default. When enabled, a helper process terminates the runtime if an active phase stops heartbeating.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Watchdog timeout (sec)</label>
                <${S}
                    label="watchdog timeout"
                    value=${W}
                    min=${0}
                    max=${3600}
                    fallback=${120}
                    width="90px"
                    disabled=${!$}
                    onChange=${w}
                />
                <span class="settings-hint" style="margin:0">How long an active phase can go without a heartbeat before the watchdog kills the runtime.</span>
            </div>

            <h3 style="margin-top:20px">Active compaction suppressions</h3>
            ${k.length===0?u`
                <p class="settings-hint">No chats are currently under compaction backoff.</p>
            `:u`
                <div class="settings-table-wrapper">
                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>Chat</th>
                                <th>Failures</th>
                                <th>Suppressed until</th>
                                <th>Last error</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${k.map((B)=>u`
                                <tr>
                                    <td><code>${B.chatJid}</code></td>
                                    <td>${B.failureCount}</td>
                                    <td>${Wi(B.backoffUntil)}</td>
                                    <td title=${B.lastErrorMessage||""}>${B.lastErrorMessage||"—"}</td>
                                    <td>
                                        <button class="settings-secondary-btn" onClick=${()=>b(B.chatJid)}>
                                            Clear
                                        </button>
                                    </td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}

            <h3 style="margin-top:20px">Live watchdog phases</h3>
            ${j.length===0?u`
                <p class="settings-hint">No active tracked phases right now.</p>
            `:u`
                <div class="settings-table-wrapper">
                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>Chat</th>
                                <th>Phase</th>
                                <th>Started</th>
                                <th>Last heartbeat</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${j.map((B)=>u`
                                <tr>
                                    <td><code>${B.chatJid}</code></td>
                                    <td>${B.phase}</td>
                                    <td>${Wi(B.startedAt)}</td>
                                    <td>${Wi(B.lastProgressAt)}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `}var to=C(()=>{E();Rn()});function uo(n){let r=String(n||"").trim().toLowerCase();if(!r)return null;let i=hu[r]||r;if(/^f(?:[1-9]|1[0-2])$/.test(i))return i;if(wu.has(i))return i;if(i.length===1)return i;if(/^[a-z0-9]+$/.test(i))return i;return null}function In(n){let r=String(n||"").trim();if(!r)return null;let i=r.split("+").map((t)=>t.trim()).filter(Boolean);if(!i.length)return null;let c={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let t of i){let s=t.toLowerCase(),_=$u[s];if(_){c[_]=!0;continue}if(c.key)return null;let l=uo(t);if(!l||l==="escape")return null;c.key=l}if(!c.key)return null;let o=[];if(c.ctrl)o.push("ctrl");if(c.meta)o.push("meta");if(c.alt)o.push("alt");if(c.shift)o.push("shift");return o.push(c.key),o.join("+")}function _o(n){return String(n||"").split(/[\n,]/).map((r)=>In(r)).filter((r)=>Boolean(r))}function dn(n){return n.join(", ")}function Ni(){let n=Cc(so);if(!n||typeof n!=="object")return{};let r={};for(let i of sr){let c=n[i.id];if(!Array.isArray(c))continue;let o=c.map((t)=>In(String(t||""))).filter((t)=>Boolean(t));r[i.id]=[...new Set(o)]}return r}function Mi(n){if(on(so,JSON.stringify(n)),typeof window<"u")window.dispatchEvent(new CustomEvent("piclaw:keyboard-shortcuts-changed",{detail:{config:n}}))}function lo(n){return pu.get(n)}function ur(n){let r=Ni()[n];if(Array.isArray(r))return r;return[...lo(n).defaultBindings]}function fo(n,r){let i=Ni(),c=lo(n).defaultBindings,o=[...new Set(r.map((t)=>In(t)).filter((t)=>Boolean(t)))];if(o.length===c.length&&o.every((t,s)=>t===c[s]))delete i[n];else i[n]=o;Mi(i)}function Ri(n){if(!n){Mi({});return}let r=Ni();delete r[n],Mi(r)}function Ur(){let n={};for(let r of sr)n[r.id]=ur(r.id);return n}function yu(n){let r=typeof n==="string"?n:"";if(!r)return"";if(r.length===1)return r.toLowerCase();return uo(r)||r.toLowerCase()}function xu(n){let r=In(n);if(!r)return null;let i={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let c of r.split("+")){if(c==="ctrl"||c==="meta"||c==="alt"||c==="shift"){i[c]=!0;continue}i.key=c}return i.key?i:null}function bu(n,r){let i=xu(r);if(!i)return!1;if(yu(n?.key)!==i.key)return!1;let o=!i.shift&&i.key.length===1&&/[^a-z0-9]/i.test(i.key);return Boolean(n?.ctrlKey)===i.ctrl&&Boolean(n?.metaKey)===i.meta&&Boolean(n?.altKey)===i.alt&&(o||Boolean(n?.shiftKey)===i.shift)}function Al(n,r){return ur(r).some((i)=>bu(n,i))}var so="piclaw_keyboard_shortcuts_v1",sr,pu,$u,hu,wu;var eo=C(()=>{sr=[{id:"openHelp",label:"Open keyboard help",description:"Open Settings → Keyboard. Default: question mark and quote when focus is outside compose and other editable fields.",defaultBindings:["?",'"']},{id:"openSettings",label:"Open settings",description:"Open the settings dialog.",defaultBindings:["ctrl+,","meta+,","alt+,"]},{id:"previousChat",label:"Previous session",description:"Switch to the previous visible chat/session.",defaultBindings:["["]},{id:"nextChat",label:"Next session",description:"Switch to the next visible chat/session.",defaultBindings:["]"]},{id:"toggleDock",label:"Toggle dock",description:"Show or hide the bottom dock panes.",defaultBindings:["ctrl+`"]},{id:"toggleZenMode",label:"Toggle zen mode",description:"Collapse surrounding chrome for a focused chat view.",defaultBindings:["ctrl+shift+z","meta+shift+z"]}],pu=new Map(sr.map((n)=>[n.id,n])),$u={cmd:"meta",command:"meta",meta:"meta",super:"meta",ctrl:"ctrl",control:"ctrl",alt:"alt",option:"alt",shift:"shift"},hu={esc:"escape",return:"enter",spacebar:"space"},wu=new Set(["tab","enter","space","backspace","delete","insert","clear","home","end","pageup","pagedown","up","down","left","right"])});var go={};nn(go,{KeyboardSection:()=>ku});function vu(n,r,i){let c=String(n||"").trim().toLowerCase();if(!c)return!0;return[r.label,r.description,i,...r.defaultBindings||[]].some((o)=>String(o||"").toLowerCase().includes(c))}function ku({filter:n="",setStatus:r}){let[i,c]=p(()=>{let l=Ur();return Object.fromEntries(Object.entries(l).map(([e,x])=>[e,dn(x)]))});P(()=>{let l=()=>{let e=Ur();c(Object.fromEntries(Object.entries(e).map(([x,f])=>[x,dn(f)])))};return window.addEventListener("piclaw:keyboard-shortcuts-changed",l),()=>window.removeEventListener("piclaw:keyboard-shortcuts-changed",l)},[]);let o=X(()=>sr.filter((l)=>{let e=String(i[l.id]||"");return vu(n,l,e)}),[i,n]),t=(l)=>{let e=String(i[l]||"").trim(),f=(e?e.split(/[\n,]/).map(($)=>$.trim()).filter(Boolean):[]).filter(($)=>!In($));if(f.length>0){r?.(`Invalid shortcut: ${f[0]}. Escape is reserved and cannot be rebound.`,"error");return}let y=_o(e);fo(l,y),c(($)=>({...$,[l]:dn(ur(l))})),r?.("Keyboard shortcuts saved.","success")},s=(l)=>{Ri(l),c((e)=>({...e,[l]:dn(ur(l))})),r?.("Keyboard shortcut reset to default.","success")};return u`
        <div class="settings-section">
            <h3>Keyboard</h3>
            <p class="settings-hint">
                Customize app-wide shortcuts as comma-separated bindings. Changes apply immediately.
                <code>Escape</code> is reserved for dismiss/abort and cannot be rebound.
            </p>
            <p class="settings-hint">
                <code>/help</code> and typing <code>"</code> outside the compose box open this pane.
            </p>

            <div class="settings-row" style="align-items:center; gap:10px; margin-bottom:18px; justify-content:flex-end;">
                <button class="settings-addon-btn" style="min-width:180px; height:40px; font-size:14px;" onClick=${()=>{Ri();let l=Ur();c(Object.fromEntries(Object.entries(l).map(([e,x])=>[e,dn(x)]))),r?.("Keyboard shortcuts reset to defaults.","success")}}>Reset all to defaults</button>
            </div>

            <div class="settings-shortcut-list" style="display:grid; gap:16px;">
                ${o.map((l)=>u`
                    <div class="settings-shortcut-card" key=${l.id} style="display:grid; grid-template-columns:minmax(240px, 1.25fr) minmax(320px, 1fr); gap:18px; align-items:start; padding:18px 20px; border:1px solid var(--border-color, rgba(120,120,120,.22)); border-radius:16px; background:var(--panel-bg, rgba(255,255,255,.04));">
                        <div class="settings-shortcut-copy" style="min-width:0;">
                            <div class="settings-shortcut-title" style="font-size:17px; font-weight:700; line-height:1.3;">${l.label}</div>
                            <div class="settings-hint" style="margin:6px 0 0 0; font-size:14px; line-height:1.5;">${l.description}</div>
                            <div class="settings-shortcut-default" style="margin-top:10px; font-size:13px; color:var(--text-secondary);">Default: <code style="font-size:13px;">${dn(l.defaultBindings)}</code></div>
                        </div>
                        <div class="settings-shortcut-controls" style="display:grid; gap:10px; min-width:0;">
                            <input
                                type="text"
                                value=${i[l.id]||""}
                                placeholder=${dn(l.defaultBindings)}
                                onInput=${(e)=>c((x)=>({...x,[l.id]:e.target.value}))}
                                style="width:100%; min-height:46px; padding:10px 14px; font-size:16px; line-height:1.35; font-family:var(--font-mono, ui-monospace, monospace); border-radius:12px;"
                            />
                            <div class="settings-shortcut-actions" style="display:flex; justify-content:flex-end; align-items:center; gap:10px; flex-wrap:wrap;">
                                <button class="settings-addon-btn settings-addon-btn-install" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>t(l.id)}>Save</button>
                                <button class="settings-addon-btn" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>s(l.id)}>Default</button>
                            </div>
                        </div>
                    </div>
                `)}
                ${o.length===0&&u`<div class="settings-hint">No shortcuts match this filter.</div>`}
            </div>
        </div>
    `}var po=C(()=>{E();eo()});function wo(n,r=ji){let i=Number(n);if(!Number.isFinite(i))return r;return Math.min(300,Math.max(15,Math.round(i)))}function yo(n,r=Ui){let i=Number(n);if(!Number.isFinite(i))return r;return Math.min(8,Math.max(0,Math.round(i)))}function Hi(){return{refreshIntervalSec:wo(Ti($o,ji),ji),folderPreviewDepth:yo(Ti(ho,Ui),Ui)}}function xo(n={}){let r=Hi(),i={refreshIntervalSec:wo(Object.prototype.hasOwnProperty.call(n,"refreshIntervalSec")?n.refreshIntervalSec:r.refreshIntervalSec,r.refreshIntervalSec),folderPreviewDepth:yo(Object.prototype.hasOwnProperty.call(n,"folderPreviewDepth")?n.folderPreviewDepth:r.folderPreviewDepth,r.folderPreviewDepth)};if(on($o,String(i.refreshIntervalSec)),on(ho,String(i.folderPreviewDepth)),typeof window<"u")window.dispatchEvent(new CustomEvent(du,{detail:{settings:i}}));return i}var du="piclaw:workspace-client-settings-updated",$o="workspaceRefreshIntervalSec",ho="workspaceFolderPreviewDepth",ji=60,Ui=3;var bo=()=>{};var ko={};nn(ko,{WorkspaceSection:()=>Bu});function vo(n={}){let r=n.workspaceSettings||{};return{webTerminalEnabled:r.webTerminalEnabled!==!1,vncAllowDirect:r.vncAllowDirect!==!1,treeMaxDepth:r.treeMaxDepth??4,treeMaxEntries:r.treeMaxEntries??5000}}function Bu({settingsData:n,setStatus:r,mergeSettingsData:i}){let[c,o]=p(!0),[t,s]=p(!0),[_,l]=p(4),[e,x]=p(5000),[f,y]=p(60),[$,v]=p(3),[W,w]=p(!1),[k,R]=p(!1),j=Q(""),d=Q(null),M=Q(null),h=Q(null),T=Q(!0);P(()=>{return T.current=!0,()=>{if(T.current=!1,d.current)clearTimeout(d.current);if(M.current)clearTimeout(M.current);if(h.current)clearTimeout(h.current)}},[]);let G=z((H)=>{let b=vo(H),B=Hi();o(b.webTerminalEnabled),s(b.vncAllowDirect),l(b.treeMaxDepth),x(b.treeMaxEntries),y(B.refreshIntervalSec),v(B.folderPreviewDepth),j.current=JSON.stringify(b)},[]);P(()=>{G(n||{})},[n,G]);let g=X(()=>JSON.stringify(vo({workspaceSettings:{webTerminalEnabled:c,vncAllowDirect:t,treeMaxDepth:_,treeMaxEntries:e}})),[c,t,_,e]);P(()=>{if(g===j.current)return;if(d.current)clearTimeout(d.current);return d.current=setTimeout(async()=>{if(!T.current)return;let H=document.activeElement;if(H&&H.closest?.(".settings-number-stepper"))return;try{let b=await vi(JSON.parse(g));if(!T.current||!b?.ok||!b?.settings)return;if(j.current=g,i?.({workspaceSettings:b.settings}),r?.(null),w(!0),M.current)clearTimeout(M.current);M.current=setTimeout(()=>{if(T.current)w(!1)},4000)}catch(b){r?.(String(b?.message||b),"error")}},800),()=>{if(d.current)clearTimeout(d.current)}},[g,i,r]);let K=z((H)=>{let b=xo(H);if(y(b.refreshIntervalSec),v(b.folderPreviewDepth),R(!0),h.current)clearTimeout(h.current);h.current=setTimeout(()=>{if(T.current)R(!1)},3000)},[]);return u`
        <div class="settings-section">
            ${W&&u`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Workspace settings applied. Server-side limits affect new workspace requests immediately.
                </div>
            `}
            ${k&&u`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Browser workspace settings applied immediately in this tab.
                </div>
            `}

            <h3>Access</h3>
            <div class="settings-row">
                <label>Enable web terminal</label>
                <input type="checkbox" checked=${c} onChange=${(H)=>o(H.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Allow direct VNC targets</label>
                <input type="checkbox" checked=${t} onChange=${(H)=>s(H.target.checked)} />
            </div>
            <p class="settings-hint">Terminal access updates immediately. Direct VNC target policy applies to new VNC requests.</p>

            <h3 style="margin-top:20px">Server scan guardrails</h3>
            <div class="settings-row">
                <label>Max tree depth</label>
                <${S}
                    label="workspace tree max depth"
                    value=${_}
                    min=${1}
                    max=${8}
                    fallback=${4}
                    width="80px"
                    onChange=${l}
                />
                <span class="settings-hint" style="margin:0">caps all <code>/workspace/tree</code> requests</span>
            </div>
            <div class="settings-row">
                <label>Max entries per scan</label>
                <${S}
                    label="workspace tree max entries"
                    value=${e}
                    min=${250}
                    max=${5000}
                    step=${250}
                    fallback=${5000}
                    width="92px"
                    onChange=${x}
                />
                <span class="settings-hint" style="margin:0">truncate oversized tree walks earlier</span>
            </div>

            <h3 style="margin-top:20px">This browser</h3>
            <div class="settings-row">
                <label>Refresh interval (seconds)</label>
                <${S}
                    label="workspace refresh interval"
                    value=${f}
                    min=${15}
                    max=${300}
                    step=${15}
                    fallback=${60}
                    width="92px"
                    onChange=${(H)=>K({refreshIntervalSec:H})}
                />
            </div>
            <div class="settings-row">
                <label>Folder preview scan depth</label>
                <${S}
                    label="folder preview scan depth"
                    value=${$}
                    min=${0}
                    max=${8}
                    fallback=${3}
                    width="80px"
                    onChange=${(H)=>K({folderPreviewDepth:H})}
                />
                <span class="settings-hint" style="margin:0">set to <code>0</code> to disable folder size preview scans</span>
            </div>
            <p class="settings-hint">Root and folder-expansion tree loads remain shallow; the folder size preview is the deepest workspace scan in the UI.</p>
        </div>
    `}var Bo=C(()=>{E();pn();bo();Rn()});var To={};nn(To,{EnvironmentSection:()=>Tu});function Li(n={}){let r=n.environmentSettings||n.settings||n.environment||{};return{variables:Array.isArray(r.variables)?r.variables:[],overrides:r.overrides&&typeof r.overrides==="object"?r.overrides:{},count:Number(r.count||0),overrideCount:Number(r.overrideCount||0),keychainEnvNames:Array.isArray(r.keychainEnvNames)?r.keychainEnvNames:[]}}function Tu({settingsData:n,filter:r="",setStatus:i,mergeSettingsData:c}){let[o,t]=p(()=>Li(n||{})),[s,_]=p({}),[l,e]=p(""),[x,f]=p(""),[y,$]=p(null);P(()=>{t(Li(n||{})),_({})},[n]);let v=z((d)=>{let M=Li({environmentSettings:d?.settings||d});return t(M),c?.({environmentSettings:M}),_({}),M},[c]),W=z(async()=>{try{let d=await ki();if(d?.ok)v(d.settings);i?.("Environment refreshed.","info")}catch(d){i?.(String(d?.message||d),"error")}},[v,i]),w=z(async(d,M)=>{let h=String(d||"").trim();if(!h)return;$(h);try{let T=await Wr({action:"set",name:h,value:String(M??"")});if(T?.ok)v(T.settings);if(i?.(`Saved environment override for ${h}.`,"info"),h===l.trim())e(""),f("")}catch(T){i?.(String(T?.message||T),"error")}finally{$(null)}},[v,l,i]),k=z(async(d)=>{let M=String(d||"").trim();if(!M)return;$(M);try{let h=await Wr({action:"clear",name:M});if(h?.ok)v(h.settings);i?.(`Cleared environment override for ${M}.`,"info")}catch(h){i?.(String(h?.message||h),"error")}finally{$(null)}},[v,i]),R=X(()=>{let d=String(r||"").trim().toLowerCase(),M=Array.isArray(o.variables)?o.variables:[];if(!d)return M;return M.filter((h)=>{return`${h?.name||""} ${h?.value||""} ${h?.source||""}`.toLowerCase().includes(d)})},[o.variables,r]),j=z((d,M)=>{_((h)=>({...h||{},[d]:M}))},[]);return u`
        <div class="settings-section">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:12px;">
                <div>
                    <h3 style="margin-top:0">Environment</h3>
                    <p class="settings-hint" style="margin-top:4px">
                        Showing non-keychain environment variables only. Overrides are stored in extension KV and applied to <code>process.env</code>, so subsequent tool calls inherit them.
                    </p>
                </div>
                <button type="button" class="settings-secondary-btn" onClick=${W}>Refresh</button>
            </div>

            <div class="settings-row" style="align-items:flex-start; gap:10px;">
                <label>Add override</label>
                <div style="display:grid; grid-template-columns:minmax(180px, 0.7fr) minmax(240px, 1fr) auto; gap:8px; flex:1;">
                    <input
                        type="text"
                        value=${l}
                        placeholder="VARIABLE_NAME"
                        spellcheck="false"
                        onInput=${(d)=>e(d.target.value)}
                    />
                    <input
                        type="text"
                        value=${x}
                        placeholder="value"
                        spellcheck="false"
                        onInput=${(d)=>f(d.target.value)}
                    />
                    <button
                        type="button"
                        disabled=${!l.trim()||y===l.trim()}
                        onClick=${()=>w(l,x)}
                    >Save</button>
                </div>
            </div>

            <p class="settings-hint">
                ${o.count} variables visible • ${o.overrideCount} overrides active • ${o.keychainEnvNames.length} keychain-injected variables hidden
            </p>

            <div class="settings-tool-list" style="max-height:58vh; overflow:auto;">
                ${R.map((d)=>{let M=String(d?.name||""),h=Object.prototype.hasOwnProperty.call(s,M)?s[M]:d.value,T=h!==d.value,G=y===M;return u`
                        <div class="settings-tool-row" key=${M} style="grid-template-columns:minmax(180px,0.45fr) minmax(240px,1fr) auto auto; align-items:center;">
                            <span class="settings-tool-name" title=${M}>${M}</span>
                            <input
                                type="text"
                                value=${h}
                                spellcheck="false"
                                onInput=${(g)=>j(M,g.target.value)}
                                style="min-width:0; width:100%; font-family:var(--font-mono, monospace);"
                            />
                            <span class="settings-tool-kind" title=${d.overridden?"Overridden in KV":"Inherited from process environment"}>
                                ${d.overridden?"override":"process"}
                            </span>
                            <span style="display:flex; gap:6px; justify-content:flex-end;">
                                <button type="button" disabled=${G||!T} onClick=${()=>w(M,h)}>Save</button>
                                <button type="button" disabled=${G||!d.overridden} onClick=${()=>k(M)}>Clear</button>
                            </span>
                        </div>
                    `})}
                ${R.length===0&&u`<p class="settings-hint">No environment variables match "${r}".</p>`}
            </div>
        </div>
    `}var Fo=C(()=>{E();pn()});var zo={};nn(zo,{ProvidersSection:()=>zu});function Fu(n){switch(n){case"oauth":return"OAuth";case"api_key":return"API key";case"custom":return"Configured";default:return"Configured"}}function zu({providers:n,setStatus:r}){let[i,c]=p(null),[o,t]=p(null),[s,_]=p({}),l=z((w,k)=>{_((R)=>({...R,[w]:k}))},[]),e=z(async(w)=>{let k=(s.apiKey||"").trim();if(!k){r?.("API key cannot be empty.","error");return}c(w),r?.(`Configuring ${w}…`,"info");try{let R=JSON.stringify({provider:w,method:"api_key",api_key:k}),j=await gn("default",`/login __step2 ${R}`,null,[]);if(j?.command?.status==="error"){r?.(j.command.message,"error");return}r?.(j?.command?.message||`${w} configured.`,"success"),t(null),_({})}catch(R){r?.(String(R.message||R),"error")}finally{c(null)}},[s,r]),x=z(async(w,k)=>{c(w),r?.(`Configuring ${w}…`,"info");try{let R={provider:w,method:"custom"};for(let M of k.customFields||[])R[M.key]=(s[M.key]||"").trim();let j=JSON.stringify(R),d=await gn("default",`/login __step2 ${j}`,null,[]);if(d?.command?.status==="error"){r?.(d.command.message,"error");return}r?.(d?.command?.message||`${w} configured.`,"success"),t(null),_({})}catch(R){r?.(String(R.message||R),"error")}finally{c(null)}},[s,r]),f=z(async(w)=>{c(w),r?.(`Starting OAuth for ${w}…`,"info");try{let k=JSON.stringify({provider:w}),j=(await gn("default",`/login __step1 ${k}`,null,[]))?.command?.message||"";if(j.includes("http")){let d=j.match(/(https?:\/\/[^\s)]+)/);if(d)window.open(d[1],"_blank","noopener"),r?.("OAuth window opened. Complete the sign-in flow, then close this message.","success");else r?.(j,"success")}else r?.(j||`OAuth flow started for ${w}. Check the chat.`,"success")}catch(k){r?.(String(k.message||k),"error")}finally{c(null)}},[r]),y=z(async(w)=>{if(i)return;c(w),r?.(`Logging out ${w}…`,"info");try{await gn("default",`/logout ${w}`,null,[]),r?.(`Logged out ${w}. Restart may be needed.`,"success")}catch(k){r?.(String(k.message||k),"error")}finally{c(null)}},[i,r]),$=n||[],v=(w)=>o===w,W=(w)=>{t((k)=>k===w?null:w),_({})};return u`
        <div class="settings-section">
            <h3>Providers</h3>
            <div class="settings-provider-list">
                ${$.map((w)=>u`
                    <div class=${`settings-provider-card${w.configured?" configured":""}`}>
                        <div class="settings-provider-card-header" onClick=${()=>!w.configured&&W(w.id)}>
                            <div class="settings-provider-card-title">
                                <strong>${w.name}</strong>
                                <span class="settings-provider-id">${w.id}</span>
                                ${w.configured&&u`<span class="settings-tag settings-tag-skill">${Fu(w.authType)}</span>`}
                            </div>
                            <div class="settings-provider-card-meta">
                                ${w.hasOAuth&&u`<span class="settings-tag">OAuth</span>`}
                                ${w.hasApiKey&&u`<span class="settings-tag">API Key</span>`}
                                ${w.isCustom&&u`<span class="settings-tag">Custom</span>`}
                            </div>
                            <div class="settings-provider-card-actions">
                                ${w.configured?u`
                                    <button class="settings-addon-btn settings-addon-btn-remove"
                                        disabled=${i===w.id} onClick=${(k)=>{k.stopPropagation(),y(w.id)}}
                                    >${i===w.id?"…":"Logout"}</button>
                                    <button class="settings-addon-btn"
                                        disabled=${i===w.id} onClick=${(k)=>{k.stopPropagation(),W(w.id)}}
                                    >Reconfigure</button>
                                `:u`
                                    <button class="settings-addon-btn settings-addon-btn-install"
                                        disabled=${i===w.id} onClick=${(k)=>{k.stopPropagation(),W(w.id)}}
                                    >Set up</button>
                                `}
                            </div>
                        </div>

                        ${v(w.id)&&u`
                            <div class="settings-provider-setup">
                                <p class="settings-hint settings-provider-setup-hint">Sign-in flows open in the browser. In narrow panes the setup form stacks vertically to avoid clipping.</p>
                                ${w.hasOAuth&&u`
                                    <div class="settings-provider-method">
                                        <button class="settings-addon-btn settings-addon-btn-install"
                                            disabled=${i===w.id}
                                            onClick=${()=>f(w.id)}>
                                            ${i===w.id?"Starting…":"Sign in with OAuth"}
                                        </button>
                                    </div>
                                `}
                                ${w.hasApiKey&&u`
                                    <div class="settings-provider-method">
                                        <div class="settings-provider-field-row">
                                            <label>API Key</label>
                                            <input type="password" value=${s.apiKey||""}
                                                onInput=${(k)=>l("apiKey",k.target.value)}
                                                placeholder=${w.apiKeyHint||"Enter API key"} />
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${i===w.id||!(s.apiKey||"").trim()}
                                                onClick=${()=>e(w.id)}>
                                                ${i===w.id?"…":"Save"}
                                            </button>
                                        </div>
                                    </div>
                                `}
                                ${w.isCustom&&u`
                                    <div class="settings-provider-method">
                                        ${(w.customFields||[]).map((k)=>u`
                                            <div class="settings-provider-field-row">
                                                <label>${k.label}${k.required?" *":""}</label>
                                                <input type="text" value=${s[k.key]||""}
                                                    onInput=${(R)=>l(k.key,R.target.value)}
                                                    placeholder=${k.placeholder||""} />
                                            </div>
                                        `)}
                                        <div class="settings-provider-form-actions">
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${i===w.id}
                                                onClick=${()=>x(w.id,w)}>
                                                ${i===w.id?"Configuring…":"Save configuration"}
                                            </button>
                                        </div>
                                    </div>
                                `}
                            </div>
                        `}
                    </div>
                `)}
            </div>
        </div>
    `}var Ko=C(()=>{E();pn()});var Wo={};nn(Wo,{ModelsSection:()=>Ru});function Mu(n){return typeof n==="string"&&n.toLowerCase()==="anthropic"}function Nu({thinkingLevel:n,supportsThinking:r,provider:i,availableLevels:c,onSetLevel:o,disabled:t}){let s=Mu(i)?Ku:Wu,_=c&&c.length>1?c:["off","minimal","low","medium","high"],l=Math.max(0,_.indexOf(n??"off"));if(!r)return u`<div class="settings-thinking-slider"><label>Thinking level</label><p class="settings-hint" style="margin:4px 0 0">Current model does not support thinking.</p></div>`;return u`
        <div class="settings-thinking-slider">
            <label>Thinking level: <strong>${s[_[l]]||_[l]}</strong></label>
            <div class="settings-slider-track">
                <input type="range" min="0" max=${_.length-1} step="1" value=${l} disabled=${t}
                    onInput=${(e)=>o(_[parseInt(e.target.value,10)])} />
                <div class="settings-slider-labels">
                    ${_.map((e,x)=>u`<span class=${x===l?"active":""} onClick=${()=>!t&&o(e)}>${s[e]||e}</span>`)}
                </div>
            </div>
        </div>
    `}function Ru({filter:n=""}){let[r,i]=p(null),[c,o]=p(!1),[t,s]=p("off"),[_,l]=p(!1),[e,x]=p(["off"]),[f,y]=p(!1),$=z(async()=>{let h=await di();if(i(h),h.thinking_level)s(h.thinking_level);if(l(Boolean(h.supports_thinking)),Array.isArray(h.available_thinking_levels)&&h.available_thinking_levels.length>0)x(h.available_thinking_levels);return h},[]);P(()=>{$().catch(()=>i({models:[],model_options:[]}))},[]);let v=z(async(h)=>{if(c)return;o(!0);try{await gn("default",`/model ${h}`,null,[]),await $()}catch(T){console.error("Failed to switch model:",T)}finally{o(!1)}},[c,$]),W=z(async(h)=>{if(f)return;y(!0),s(h);try{let T=await gn("default",`/thinking ${h}`,null,[]);if(T?.command?.thinking_level)s(T.command.thinking_level);l(T?.command?.supports_thinking!==!1),await $()}catch(T){console.error("Failed to set thinking:",T),await $().catch((G)=>{})}finally{y(!1)}},[f,$]);if(!r)return u`<div class="settings-loading">Loading models\u2026</div>`;let w=r.model_options||[],k=r.current,j=w.find((h)=>h.label===k)?.provider||"",d=n.toLowerCase(),M=d?w.filter((h)=>h.label.toLowerCase().includes(d)||(h.provider||"").toLowerCase().includes(d)):w;return u`
        <div class="settings-models-split">
            <div class="settings-models-summary settings-hint">Model and provider names may wrap in narrow panes to avoid clipping.</div>
            <div class="settings-models-list">
                <table class="settings-table settings-borderless settings-models-table">
                    <thead><tr><th style="width:32px"></th><th>Model</th><th>Provider</th><th>Context</th><th style="text-align:center">Reasoning</th></tr></thead>
                    <tbody>
                        ${M.map((h)=>u`
                            <tr class=${h.label===k?"settings-row-active":""}>
                                <td><input type="radio" name="settings-model" checked=${h.label===k} disabled=${c} onChange=${()=>v(h.label)} /></td>
                                <td>${h.name||h.label}</td><td>${h.provider}</td>
                                <td>${h.context_window?(h.context_window/1000).toFixed(0)+"K":"—"}</td>
                                <td style="text-align:center">${h.reasoning?"\uD83E\uDDE0":"—"}</td>
                            </tr>
                        `)}
                        ${M.length===0&&u`<tr><td colspan="5" class="settings-empty">No models match "${n}"</td></tr>`}
                    </tbody>
                </table>
            </div>
            <div class="settings-models-footer">
                <${Nu}
                    thinkingLevel=${t}
                    supportsThinking=${_}
                    provider=${j}
                    availableLevels=${e}
                    onSetLevel=${W}
                    disabled=${f||c} />
            </div>
        </div>
    `}var Ku,Wu;var Mo=C(()=>{E();pn();Ku={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"max"},Wu={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"xhigh"}});function Vi(n){let r=String(n||"").trim().toLowerCase();if(!r)return"default";if(r==="solarized-dark"||r==="solarized-light")return"solarized";if(r==="github-dark"||r==="github-light")return"github";if(r==="tokyo-night")return"tokyo";return r}function Uo(n){if(!n)return null;let r=String(n).trim();if(!r)return null;let i=r.startsWith("#")?r.slice(1):r;if(!/^[0-9a-fA-F]{3}$/.test(i)&&!/^[0-9a-fA-F]{6}$/.test(i))return null;let c=i.length===3?i.split("").map((t)=>t+t).join(""):i,o=parseInt(c,16);return{r:o>>16&255,g:o>>8&255,b:o&255,hex:`#${c.toLowerCase()}`}}function Uu(n,r){try{if(document.body){n.style.display="none",document.body.appendChild(n);let i=getComputedStyle(n).color||n.style.color;return document.body.removeChild(n),i}}catch{return r}return r}function Hu(n){if(!n||typeof document>"u")return null;let r=String(n).trim();if(!r)return null;let i=document.createElement("div");if(i.style.color="",i.style.color=r,!i.style.color)return null;let o=Uu(i,i.style.color).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!o)return null;let t=parseInt(o[1],10),s=parseInt(o[2],10),_=parseInt(o[3],10);if(![t,s,_].every((e)=>Number.isFinite(e)))return null;let l=`#${[t,s,_].map((e)=>e.toString(16).padStart(2,"0")).join("")}`;return{r:t,g:s,b:_,hex:l}}function jn(n){return Uo(n)||Hu(n)}function Ai(n,r,i){let c=Math.round(n.r+(r.r-n.r)*i),o=Math.round(n.g+(r.g-n.g)*i),t=Math.round(n.b+(r.b-n.b)*i);return`rgb(${c} ${o} ${t})`}function Hr(n,r){return`rgba(${n.r}, ${n.g}, ${n.b}, ${r})`}function Lu(n){let r=n.r/255,i=n.g/255,c=n.b/255,o=r<=0.03928?r/12.92:Math.pow((r+0.055)/1.055,2.4),t=i<=0.03928?i/12.92:Math.pow((i+0.055)/1.055,2.4),s=c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);return 0.2126*o+0.7152*t+0.0722*s}function Gu(n){return Lu(n)>0.4?"#000000":"#ffffff"}function Ho(){if(typeof window>"u")return"light";try{return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch{return"light"}}function Xi(n){return No[n]||No.default}function Pu(n){return n.mode==="auto"?Ho():n.mode}function Lo(n,r){let i=Xi(n);if(r==="dark"&&i.dark)return i.dark;if(r==="light"&&i.light)return i.light;return i.dark||i.light||wn}function hn(n,r,i){let c=jn(n);if(!c)return n;return Ai(c,r,i)}function Go(n,r,i){let c=jn(r);if(!c)return n;let t=Uo(i==="dark"?"#ffffff":"#000000");return{...n,bgPrimary:hn(n.bgPrimary,c,0.08),bgSecondary:hn(n.bgSecondary,c,0.12),bgHover:hn(n.bgHover,c,0.16),textPrimary:hn(n.textPrimary,c,i==="dark"?0.08:0.06),textSecondary:hn(n.textSecondary,c,i==="dark"?0.12:0.1),borderColor:hn(n.borderColor,c,0.1),accent:c.hex,accentHover:t?Ai(c,t,0.18):c.hex,warning:hn(n.warning||wn.warning,c,0.14),danger:hn(n.danger,c,0.16),success:hn(n.success,c,0.16)}}function Vu(n,r){let i=jn(n?.warning);if(i)return i.hex;let c=jn(r==="dark"?Pr.warning:wn.warning)||jn(wn.warning),o=jn(n?.accent);if(c&&o)return Ai(c,o,r==="dark"?0.18:0.14);return r==="dark"?Pr.warning:wn.warning}function Au(n,r){if(typeof document>"u")return;let i=document.documentElement,c=n.accent,o=jn(c),t=o?Hr(o,r==="dark"?0.35:0.2):n.searchHighlight||n.searchHighlightColor,s=o?Hr(o,r==="dark"?0.16:0.12):"rgba(29, 155, 240, 0.12)",_=o?Hr(o,r==="dark"?0.28:0.2):"rgba(29, 155, 240, 0.2)",l=o?Gu(o):r==="dark"?"#000000":"#ffffff",e=o?Hr(o,r==="dark"?0.35:0.25):"rgba(29, 155, 240, 0.25)",x=Vu(n,r),f={"--bg-primary":n.bgPrimary,"--bg-secondary":n.bgSecondary,"--bg-hover":n.bgHover,"--text-primary":n.textPrimary,"--text-secondary":n.textSecondary,"--border-color":n.borderColor,"--accent-color":c,"--accent-hover":n.accentHover||c,"--accent-color-alpha":e,"--accent-soft":s,"--accent-soft-strong":_,"--accent-contrast-text":l,"--warning-color":x,"--danger-color":n.danger||wn.danger,"--success-color":n.success||wn.success,"--search-highlight-color":t||"rgba(29, 155, 240, 0.2)"};Object.entries(f).forEach(([y,$])=>{if($)i.style.setProperty(y,$)})}function Xu(){if(typeof document>"u")return;let n=document.documentElement;ju.forEach((r)=>n.style.removeProperty(r))}function Zn(n,r={}){if(typeof document>"u")return null;let i=typeof r.id==="string"&&r.id.trim()?r.id.trim():null,c=i?document.getElementById(i):document.querySelector(`meta[name="${n}"]`);if(!c)c=document.createElement("meta"),document.head.appendChild(c);if(c.setAttribute("name",n),i)c.setAttribute("id",i);return c}function Ro(n){let r=Vi(Un?.theme||"default"),i=Un?.tint?String(Un.tint).trim():null,c=Lo(r,n);if(r==="default"&&i)c=Go(c,i,n);if(c?.bgPrimary)return c.bgPrimary;return n==="dark"?Pr.bgPrimary:wn.bgPrimary}function Qu(n,r){if(typeof document>"u")return;let i=Zn("theme-color",{id:"dynamic-theme-color"});if(i&&n)i.removeAttribute("media"),i.setAttribute("content",n);let c=Zn("theme-color",{id:"theme-color-light"});if(c)c.setAttribute("media","(prefers-color-scheme: light)"),c.setAttribute("content",Ro("light"));let o=Zn("theme-color",{id:"theme-color-dark"});if(o)o.setAttribute("media","(prefers-color-scheme: dark)"),o.setAttribute("content",Ro("dark"));let t=Zn("msapplication-TileColor");if(t&&n)t.setAttribute("content",n);let s=Zn("msapplication-navbutton-color");if(s&&n)s.setAttribute("content",n);let _=Zn("apple-mobile-web-app-status-bar-style");if(_)_.setAttribute("content",r==="dark"?"black-translucent":"default")}function Cu(){if(typeof window>"u")return;let n={...Un,mode:jo};window.dispatchEvent(new CustomEvent("piclaw-theme-change",{detail:n}))}function qu(){if(typeof window>"u")return"web:default";try{let r=new URL(window.location.href).searchParams.get("chat_jid");return r&&r.trim()?r.trim():"web:default"}catch{return"web:default"}}function Du(n){if(typeof document>"u"||!n)return;let r=document.documentElement;if(r?.style)r.style.background=n;if(document.body?.style)document.body.style.background=n}function Qi(n,r={}){if(typeof window>"u"||typeof document>"u")return;let i=Vi(n?.theme||"default"),c=n?.tint?String(n.tint).trim():null,o=Xi(i),t=Pu(o),s=Lo(i,t);Un={theme:i,tint:c},jo=t;let _=document.documentElement;_.dataset.theme=t,_.dataset.colorTheme=i,_.dataset.tint=c?String(c):"",_.style.colorScheme=t;let l=s;if(i==="default"&&c)l=Go(s,c,t);if(i==="default"&&!c)Xu();else Au(l,t);if(Du(l.bgPrimary),Qu(l.bgPrimary,t),Cu(),r.persist!==!1)if(on(Pi,i),c)on(Gr,c);else on(Gr,"")}function Lr(){if(Xi(Un.theme).mode!=="auto")return;Qi(Un,{persist:!1})}function Iu(){if(typeof window>"u")return;let n=Vi(Dn(Pi)||"default"),r=(()=>{let i=Dn(Gr);return i?i.trim():null})();Qi({theme:n,tint:r},{persist:!1})}function cf(){if(typeof window>"u")return()=>{};if(Iu(),window.matchMedia&&!Gi){let n=window.matchMedia("(prefers-color-scheme: dark)");if(n.addEventListener)n.addEventListener("change",Lr);else if(n.addListener)n.addListener(Lr);return Gi=!0,()=>{if(n.removeEventListener)n.removeEventListener("change",Lr);else if(n.removeListener)n.removeListener(Lr);Gi=!1}}return()=>{}}function Ci(n){if(!n||typeof n!=="object")return;let r=qu(),i=n.chat_jid||n.chatJid||null,c=n.theme??n.name??n.colorTheme,o=n.tint??null;if(!i||i===r)Qi({theme:c||"default",tint:o},{persist:!1});on(Pi,c||"default"),on(Gr,o||"")}function of(){if(typeof document>"u")return"light";let n=document.documentElement?.dataset?.theme;if(n==="dark"||n==="light")return n;return Ho()}var Pi="piclaw_theme",Gr="piclaw_tint",wn,Pr,No,ju,Un,jo="light",Gi=!1;var Po=C(()=>{wn={bgPrimary:"#ffffff",bgSecondary:"#f7f9fa",bgHover:"#e8ebed",textPrimary:"#0f1419",textSecondary:"#536471",borderColor:"#eff3f4",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},Pr={bgPrimary:"#000000",bgSecondary:"#16181c",bgHover:"#1d1f23",textPrimary:"#e7e9ea",textSecondary:"#71767b",borderColor:"#2f3336",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},No={default:{label:"Default",mode:"auto",light:wn,dark:Pr},tango:{label:"Tango",mode:"light",light:{bgPrimary:"#f6f5f4",bgSecondary:"#efedeb",bgHover:"#e5e3e1",textPrimary:"#2e3436",textSecondary:"#5c6466",borderColor:"#d3d7cf",accent:"#3465a4",accentHover:"#2c5890",danger:"#cc0000",success:"#4e9a06"}},xterm:{label:"XTerm",mode:"dark",dark:{bgPrimary:"#000000",bgSecondary:"#0a0a0a",bgHover:"#121212",textPrimary:"#d0d0d0",textSecondary:"#8a8a8a",borderColor:"#1f1f1f",accent:"#00a2ff",accentHover:"#0086d1",danger:"#ff5f5f",success:"#5fff87"}},monokai:{label:"Monokai",mode:"dark",dark:{bgPrimary:"#272822",bgSecondary:"#2f2f2f",bgHover:"#3a3a3a",textPrimary:"#f8f8f2",textSecondary:"#cfcfc2",borderColor:"#3e3d32",accent:"#f92672",accentHover:"#e81560",danger:"#f92672",success:"#a6e22e"}},"monokai-pro":{label:"Monokai Pro",mode:"dark",dark:{bgPrimary:"#2d2a2e",bgSecondary:"#363237",bgHover:"#403a40",textPrimary:"#fcfcfa",textSecondary:"#c1c0c0",borderColor:"#444046",accent:"#ff6188",accentHover:"#f74f7e",danger:"#ff4f5e",success:"#a9dc76"}},ristretto:{label:"Ristretto",mode:"dark",dark:{bgPrimary:"#2c2525",bgSecondary:"#362d2d",bgHover:"#403535",textPrimary:"#f4f1ef",textSecondary:"#cbbdb8",borderColor:"#4a3c3c",accent:"#ff9f43",accentHover:"#f28a2e",danger:"#ff5f56",success:"#a9dc76"}},dracula:{label:"Dracula",mode:"dark",dark:{bgPrimary:"#282a36",bgSecondary:"#303445",bgHover:"#3a3f52",textPrimary:"#f8f8f2",textSecondary:"#c5c8d6",borderColor:"#44475a",accent:"#bd93f9",accentHover:"#a87ded",danger:"#ff5555",success:"#50fa7b"}},catppuccin:{label:"Catppuccin",mode:"dark",dark:{bgPrimary:"#1e1e2e",bgSecondary:"#24273a",bgHover:"#2c2f41",textPrimary:"#cdd6f4",textSecondary:"#a6adc8",borderColor:"#313244",accent:"#89b4fa",accentHover:"#74a0f5",danger:"#f38ba8",success:"#a6e3a1"}},nord:{label:"Nord",mode:"dark",dark:{bgPrimary:"#2e3440",bgSecondary:"#3b4252",bgHover:"#434c5e",textPrimary:"#eceff4",textSecondary:"#d8dee9",borderColor:"#4c566a",accent:"#88c0d0",accentHover:"#78a9c0",danger:"#bf616a",success:"#a3be8c"}},gruvbox:{label:"Gruvbox",mode:"dark",dark:{bgPrimary:"#282828",bgSecondary:"#32302f",bgHover:"#3c3836",textPrimary:"#ebdbb2",textSecondary:"#bdae93",borderColor:"#3c3836",accent:"#d79921",accentHover:"#c28515",danger:"#fb4934",success:"#b8bb26"}},solarized:{label:"Solarized",mode:"auto",light:{bgPrimary:"#fdf6e3",bgSecondary:"#f5efdc",bgHover:"#eee8d5",textPrimary:"#586e75",textSecondary:"#657b83",borderColor:"#e0d8c6",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"},dark:{bgPrimary:"#002b36",bgSecondary:"#073642",bgHover:"#0b3c4a",textPrimary:"#eee8d5",textSecondary:"#93a1a1",borderColor:"#18424a",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"}},tokyo:{label:"Tokyo",mode:"dark",dark:{bgPrimary:"#1a1b26",bgSecondary:"#24283b",bgHover:"#2f3549",textPrimary:"#c0caf5",textSecondary:"#9aa5ce",borderColor:"#414868",accent:"#7aa2f7",accentHover:"#6b92e6",danger:"#f7768e",success:"#9ece6a"}},miasma:{label:"Miasma",mode:"dark",dark:{bgPrimary:"#1f1f23",bgSecondary:"#29292f",bgHover:"#33333a",textPrimary:"#e5e5e5",textSecondary:"#b4b4b4",borderColor:"#3d3d45",accent:"#c9739c",accentHover:"#b8618c",danger:"#e06c75",success:"#98c379"}},github:{label:"GitHub",mode:"auto",light:{bgPrimary:"#ffffff",bgSecondary:"#f6f8fa",bgHover:"#eaeef2",textPrimary:"#24292f",textSecondary:"#57606a",borderColor:"#d0d7de",accent:"#0969da",accentHover:"#0550ae",danger:"#cf222e",success:"#1a7f37"},dark:{bgPrimary:"#0d1117",bgSecondary:"#161b22",bgHover:"#21262d",textPrimary:"#c9d1d9",textSecondary:"#8b949e",borderColor:"#30363d",accent:"#2f81f7",accentHover:"#1f6feb",danger:"#f85149",success:"#3fb950"}},gotham:{label:"Gotham",mode:"dark",dark:{bgPrimary:"#0b0f14",bgSecondary:"#111720",bgHover:"#18212b",textPrimary:"#cbd6e2",textSecondary:"#9bb0c3",borderColor:"#1f2a37",accent:"#5ccfe6",accentHover:"#48b8ce",danger:"#d26937",success:"#2aa889"}}},ju=["--bg-primary","--bg-secondary","--bg-hover","--text-primary","--text-secondary","--border-color","--accent-color","--accent-hover","--accent-color-alpha","--accent-contrast-text","--accent-soft","--accent-soft-strong","--warning-color","--danger-color","--success-color","--search-highlight-color"],Un={theme:"default",tint:null}});var Ao={};nn(Ao,{ThemeSection:()=>Zu});function Vo(n={}){return{uiTheme:typeof n.uiTheme==="string"&&n.uiTheme.trim()?n.uiTheme.trim():"default",uiTint:typeof n.uiTint==="string"&&n.uiTint.trim()?n.uiTint.trim():""}}function Zu({themes:n,colorKeys:r,settingsData:i,setStatus:c,mergeSettingsData:o}){let[t,s]=p("default"),[_,l]=p(""),[e,x]=p(!1),f=Q(""),y=Q(null),$=Q(!0);P(()=>{return $.current=!0,()=>{$.current=!1}},[]);let v=z((j)=>{let d=Vo(j);s(d.uiTheme),l(d.uiTint),f.current=JSON.stringify(d)},[]);P(()=>{if(i){v(i);return}v({uiTheme:document.documentElement.dataset.colorTheme||"default",uiTint:document.documentElement.dataset.tint||""})},[i,v]);let W=z((j,d)=>{Ci({theme:j,tint:d||null}),s(j||"default"),l(d||"")},[]),w=X(()=>JSON.stringify(Vo({uiTheme:t,uiTint:_})),[t,_]);P(()=>{if(w===f.current)return;if(y.current)clearTimeout(y.current);return y.current=setTimeout(async()=>{if(!$.current)return;x(!0);try{let j=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:w}),d=await j.json().catch(()=>({}));if(!$.current)return;if(!j.ok||!d?.ok||!d?.settings){c?.(d?.error||"Failed to save appearance settings.","error");return}f.current=w,o?.(d.settings),c?.("Appearance synced across clients.","success")}catch(j){if(!$.current)return;console.warn("[settings/appearance] Failed to persist appearance settings.",j),c?.("Failed to save appearance settings.","error")}finally{if($.current)x(!1)}},250),()=>{if(y.current)clearTimeout(y.current)}},[w,o,c]);let k=r||[],R=n||[];return u`
        <div class="settings-section">
            ${e&&u`<div class="settings-hint" style="margin:0 0 12px 0;">Syncing appearance…</div>`}
            <div class="settings-tint-row">
                <label class="settings-tint-label">
                    <input type="radio" name="settings-theme"
                        checked=${t==="default"}
                        onChange=${()=>W("default",_)} />
                    <strong>Default</strong>
                    <span class="settings-hint" style="margin:0 0 0 6px">auto (light/dark)</span>
                </label>
                <div class="settings-tint-picker">
                    <label class="settings-hint" style="margin:0">Tint:</label>
                    <input type="color"
                        value=${_||"#1d9bf0"}
                        onInput=${(j)=>{let d=j.target.value;if(l(d),t==="default")Ci({theme:"default",tint:d})}} />
                    ${_&&u`
                        <button class="settings-tint-clear" onClick=${()=>W("default","")}
                            title="Clear tint">\u2715</button>
                    `}
                    <span class="settings-tint-hex">${_||"none"}</span>
                </div>
            </div>

            <table class="settings-table settings-borderless settings-theme-table">
                <thead>
                    <tr>
                        <th></th><th>Theme</th><th>Mode</th>
                        ${k.map((j)=>u`<th class="settings-swatch-header">${j.replace(/([A-Z])/g," $1").trim()}</th>`)}
                    </tr>
                </thead>
                <tbody>
                    ${R.filter((j)=>j.name!=="default").map((j)=>u`
                        <tr class=${j.name===t?"settings-row-active":""}
                            style="cursor:pointer" onClick=${()=>W(j.name,"")}>
                            <td><input type="radio" name="settings-theme" checked=${j.name===t} onChange=${()=>W(j.name,"")} /></td>
                            <td><strong>${j.label}</strong></td>
                            <td>${j.mode}</td>
                            ${k.map((d)=>{let M=j.colors?.[d];return u`<td class="settings-swatch-cell">
                                    ${M?u`<span class="settings-color-swatch" style=${"background:"+M} title=${M}></span>`:"—"}
                                </td>`})}
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `}var Xo=C(()=>{E();Po()});var Co={};nn(Co,{__scheduledTasksSettingsTest:()=>au,ScheduledTasksSection:()=>Su});function Hn(n){if(!n)return"—";let r=new Date(n);if(Number.isNaN(r.getTime()))return n;return r.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Qo(n){let r=Number(n);if(!Number.isFinite(r))return"—";if(r<1000)return`${Math.round(r)}ms`;return`${(r/1000).toFixed(r<1e4?1:0)}s`}function qi(n){if(!n)return"—";if(n.schedule_type==="once")return`once · ${Hn(n.schedule_value)}`;if(n.schedule_type==="interval")return`interval · ${n.schedule_value}`;if(n.schedule_type==="cron")return`cron · ${n.schedule_value}`;return`${n.schedule_type||"schedule"} · ${n.schedule_value||"—"}`}function Di(n){let r=n?.task_kind||"agent";return r==="internal"?"internal/protected":r}function Ii(n){return(n?.task_kind||"agent")==="internal"}function Ou(n){if(!n)return"";let r=String(n).replace(/\s+/g," ").trim();return r.length>180?`${r.slice(0,179)}…`:r}function Yn({children:n,type:r="neutral"}){return u`<span class=${`settings-task-pill settings-task-pill-${r}`}>${n}</span>`}function Ju({task:n}){let r=Array.isArray(n?.recent_run_logs)?n.recent_run_logs:[];if(!r.length)return u`<p class="settings-hint">No run logs recorded yet.</p>`;return u`
        <div class="settings-task-run-list">
            ${r.map((i)=>u`
                <div class=${`settings-task-run-row settings-task-run-${i.status||"unknown"}`}>
                    <div class="settings-task-run-meta">
                        <${Yn} type=${i.status==="error"?"error":"success"}>${i.status||"unknown"}<//>
                        <span>${Hn(i.run_at)}</span>
                        <span>${Qo(i.duration_ms)}</span>
                    </div>
                    <div class="settings-task-run-summary">
                        ${i.error_summary||Ou(i.error)||i.result_summary||i.result||"No summary"}
                    </div>
                </div>
            `)}
        </div>
    `}function Eu({task:n,onAction:r}){if(!n)return u`<div class="settings-task-detail-empty">Select a task to inspect schedule, status, and run history.</div>`;let i=Ii(n);return u`
        <div class="settings-task-detail">
            <div class="settings-task-detail-header">
                <div>
                    <h4>${n.summary||n.id}</h4>
                    <code>${n.id}</code>
                </div>
                <div class="settings-task-detail-actions">
                    ${n.status==="active"&&u`<button onClick=${()=>r("pause",n)}>Pause</button>`}
                    ${n.status==="paused"&&u`<button onClick=${()=>r("resume",n)}>Resume</button>`}
                    <button class="danger" onClick=${()=>r("delete",n)}>Delete</button>
                </div>
            </div>
            <div class="settings-task-detail-grid">
                <span>Status</span><strong>${n.status||"—"}</strong>
                <span>Kind</span><strong>${Di(n)}</strong>
                <span>Schedule</span><strong>${qi(n)}</strong>
                <span>Next run</span><strong>${Hn(n.next_run)}</strong>
                <span>Last run</span><strong>${Hn(n.last_run)}</strong>
                <span>Last result</span><strong>${n.latest_run_log?.status||n.last_result||"—"}</strong>
                <span>Chat</span><code>${n.chat_jid||"—"}</code>
                <span>Model</span><code>${n.model||"default"}</code>
                ${n.cwd&&u`<span>CWD</span><code>${n.cwd}</code>`}
                ${n.timeout_sec&&u`<span>Timeout</span><strong>${n.timeout_sec}s</strong>`}
                ${i&&u`<span>Protection</span><strong>Internal task actions require explicit confirmation.</strong>`}
            </div>
            <div class="settings-task-command-block">
                <strong>${n.task_kind==="shell"?"Command":"Prompt"}</strong>
                <pre>${n.command||n.prompt||n.command_summary||n.prompt_summary||n.summary||"—"}</pre>
            </div>
            <h4>Recent runs</h4>
            <${Ju} task=${n} />
        </div>
    `}function Su({filter:n="",setStatus:r}){let[i,c]=p([]),[o,t]=p({active:0,paused:0,completed:0}),[s,_]=p("all"),[l,e]=p(""),[x,f]=p(!0),[y,$]=p(null),[v,W]=p(null),[w,k]=p(null),[R,j]=p(!1),d=z(async(g={})=>{f(!0),$(null);try{let K=await _i({status:s,chatJid:l.trim()||void 0,limit:50,includeRunLogs:!0,runLogLimit:5});c(K.tasks||[]),t(K.counts||{active:0,paused:0,completed:0});let H=g.selectedId||v,b=(K.tasks||[]).find((B)=>B.id===H)||(K.tasks||[])[0]||null;W(b?.id||null),k(b)}catch(K){$(K?.message||"Failed to load scheduled tasks.")}finally{f(!1)}},[s,l,v]);P(()=>{d()},[d]);let M=String(n||"").trim().toLowerCase(),h=X(()=>{if(!M)return i;return i.filter((g)=>[g.id,g.chat_jid,g.status,g.task_kind,g.schedule_type,g.schedule_value,g.summary,g.prompt_summary,g.command_summary,g.latest_run_log?.error_summary].some((K)=>String(K||"").toLowerCase().includes(M)))},[i,M]),T=z((g)=>{W(g?.id||null),k(g||null)},[]),G=z(async(g,K)=>{if(!K||R)return;let H=Ii(K),b=K.summary||K.command_summary||K.prompt_summary||K.id,B=g==="delete"?`Delete scheduled task ${K.id}?

${b}`:`${g==="pause"?"Pause":"Resume"} scheduled task ${K.id}?

${b}`;if(!window.confirm(B))return;if(H&&!window.confirm(`Task ${K.id} is internal/protected. Continue with ${g}?`))return;j(!0),r?.(`${g==="delete"?"Deleting":g==="pause"?"Pausing":"Resuming"} ${K.id}…`,"info");try{await li(g,K.id,{allowInternal:H}),r?.(`Scheduled task ${K.id} ${g==="delete"?"deleted":g==="pause"?"paused":"resumed"}.`,"success"),await d({selectedId:g==="delete"?null:K.id})}catch(N){r?.(N?.message||`Failed to ${g} task.`,"error")}finally{j(!1)}},[R,d,r]);return u`
        <div class="settings-section settings-scheduled-tasks-section">
            <div class="settings-task-toolbar">
                <div class="settings-task-counts">
                    <${Yn} type="active">Active ${o.active||0}<//>
                    <${Yn} type="paused">Paused ${o.paused||0}<//>
                    <${Yn} type="completed">Completed ${o.completed||0}<//>
                </div>
                <div class="settings-task-filters">
                    <select value=${s} onChange=${(g)=>_(g.target.value)}>
                        ${Yu.map((g)=>u`<option value=${g}>${g==="all"?"All statuses":g}</option>`)}
                    </select>
                    <input type="text" placeholder="Filter chat JID…" value=${l} onInput=${(g)=>e(g.target.value)} />
                    <button onClick=${()=>d()} disabled=${x}>Refresh</button>
                </div>
            </div>

            ${x&&u`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading scheduled tasks…</span></div>`}
            ${y&&u`<div class="settings-error-state">${y}</div>`}
            ${!x&&!y&&i.length===0&&u`
                <div class="settings-empty-state">
                    <strong>No scheduled tasks found.</strong>
                    <p>Tasks created with reminders, `/i`, or the scheduler tool will appear here.</p>
                </div>
            `}
            ${!x&&!y&&i.length>0&&u`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Scheduled tasks">
                        ${h.map((g)=>u`
                            <button class=${`settings-task-row ${g.id===v?"active":""}`} onClick=${()=>T(g)}>
                                <span class="settings-task-row-main">
                                    <strong>${g.summary||g.id}</strong>
                                    <span>${qi(g)}</span>
                                </span>
                                <span class="settings-task-row-meta">
                                    <${Yn} type=${g.status||"neutral"}>${g.status}<//>
                                    <${Yn}>${Di(g)}<//>
                                </span>
                                <span class="settings-task-row-times">Next ${Hn(g.next_run)} · Last ${Hn(g.last_run)}${g.latest_run_log?.status?` · ${g.latest_run_log.status}`:""}</span>
                            </button>
                        `)}
                        ${h.length===0&&u`<p class="settings-hint">No tasks match “${n}”.</p>`}
                    </div>
                    <${Eu} task=${w&&h.some((g)=>g.id===w.id)?w:h[0]} onAction=${G} />
                </div>
            `}
        </div>
    `}var Yu,au;var qo=C(()=>{E();pn();Yu=["all","active","paused","completed"];au={formatDateTime:Hn,formatDuration:Qo,labelForSchedule:qi,kindLabel:Di,isProtectedTask:Ii}});function Do(n){return String(n||"").toLowerCase().replace(/^[@/]+/,"").replace(/\s+/g," ").trim()}function On(n){return typeof n==="string"&&n.trim().length>0}function Zi(n,...r){let i=Do(n);if(!i)return!0;let c=r.map((o)=>Do(o)).filter(Boolean);for(let o of c)if(o.startsWith(i)||o.includes(i))return!0;return!1}function Io(n){if(!Array.isArray(n))return null;let r=[],i=new Set;for(let c of n){let o=String(c||"").trim();if(!o)continue;let t=o.toLowerCase();if(i.has(t))continue;i.add(t),r.push(o)}return r}function _r(n){let r=n&&typeof n==="object"?n:{};return{workspaceCommands:Io(r.workspaceCommands),slashCommands:Io(r.slashCommands)}}function Zo(n,r){if(!Array.isArray(n))return!0;return n.some((i)=>i.toLowerCase()===r.toLowerCase())}function mu(n){let r=Array.isArray(n?.commands)?n.commands:[],i=_r(n?.settings),c=String(n?.query||"");return r.filter((o)=>Zo(i.workspaceCommands,o.id)).filter((o)=>Zi(c,o.label,o.description,...o.keywords||[])).map((o)=>({key:`workspace:${o.id}`,kind:"workspace",title:o.label,subtitle:o.description,searchText:`${o.label} ${o.description} ${(o.keywords||[]).join(" ")}`.trim(),visualHint:o.label.slice(0,1).toUpperCase()||"W",categoryLabel:"Workspace",actionHint:"Run",commandId:o.id}))}function n_(n){let r=Array.isArray(n?.agents)?n.agents:[],i=String(n?.query||""),c=new Set;return r.filter((o)=>{let t=On(o?.chat_jid)?o.chat_jid.trim():"";if(!t||c.has(t))return!1;if(o?.archived_at)return!1;return c.add(t),!0}).filter((o)=>Zi(i,`@${String(o?.agent_name||"").trim()}`,o?.session_name,o?.chat_jid)).map((o)=>{let t=On(o?.agent_name)?o.agent_name.trim():String(o?.chat_jid||"").replace(/^[^:]+:/,""),s=On(o?.session_name)?o.session_name.trim():"",_=String(o?.chat_jid||"").trim();return{key:`agent:${_}`,kind:"agent",title:`@${t}`,subtitle:s||_,searchText:`@${t} ${s} ${_}`.trim(),visualHint:t.slice(0,1).toUpperCase()||"@",categoryLabel:"Agent",actionHint:"Open",chatJid:_}})}function r_(n){let r=Array.isArray(n?.slashCommands)?n.slashCommands:[],i=_r(n?.settings),c=String(n?.query||""),o=new Set;return r.filter((t)=>{let s=On(t?.name)?t.name.trim():"";if(!s||o.has(s.toLowerCase()))return!1;return o.add(s.toLowerCase()),Zo(i.slashCommands,s)}).filter((t)=>Zi(c,t?.name,t?.description,t?.source)).map((t)=>{let s=String(t?.name||"").trim(),_=On(t?.description)?t.description.trim():"slash command",l=On(t?.source)?t.source.trim():"";return{key:`slash:${s}`,kind:"slash",title:s,subtitle:_,searchText:`${s} ${_} ${String(t?.source||"")}`.trim(),visualHint:"/",categoryLabel:l||"Slash",actionHint:"Insert",commandName:s}})}function ff(n){return[...n_({agents:n?.agents,query:n?.query}),...mu({commands:n?.workspaceCommands,settings:n?.settings,query:n?.query}),...r_({slashCommands:n?.slashCommands,settings:n?.settings,query:n?.query})]}var Jn;var Yo=C(()=>{Jn=[{id:"toggle-workspace",label:"Toggle workspace",description:"Show or hide the workspace sidebar.",keywords:["workspace","sidebar","explorer"]},{id:"open-explorer",label:"Open explorer",description:"Open the workspace explorer sidebar.",keywords:["workspace","explorer","sidebar"]},{id:"toggle-chat-only",label:"Chat-only mode",description:"Toggle chat-only mode.",keywords:["chat","mode","layout"]},{id:"open-terminal-tab",label:"Open terminal in tab",description:"Open the terminal pane in a workspace tab.",keywords:["terminal","shell","tab"]},{id:"open-vnc-tab",label:"Open VNC in tab",description:"Open the VNC viewer in a workspace tab.",keywords:["vnc","remote","desktop","tab"]},{id:"toggle-terminal-dock",label:"Toggle terminal dock",description:"Show or hide the terminal dock.",keywords:["terminal","dock","shell"]},{id:"open-settings",label:"Settings",description:"Open the settings dialog.",keywords:["settings","preferences","config"]}]});var Eo={};nn(Eo,{QuickActionsSection:()=>i_});function Oo(n,...r){let i=String(n||"").trim().toLowerCase();if(!i)return!0;return r.some((c)=>String(c||"").toLowerCase().includes(i))}function Jo(n){if(!Array.isArray(n))return null;return new Set(n.map((r)=>String(r||"").trim().toLowerCase()).filter(Boolean))}function i_({filter:n="",setStatus:r,mergeSettingsData:i}){let[c,o]=p(()=>Jn.map((h)=>h.id)),[t,s]=p([]),[_,l]=p([]),[e,x]=p(!0),[f,y]=p(!1),$=z(async()=>{x(!0);try{let[h,T]=await Promise.all([xi(),yi("web:default").catch(()=>({commands:[]}))]),G=_r(h?.settings),g=Array.isArray(T?.commands)?T.commands:[];l(g),o(Array.isArray(G.workspaceCommands)?G.workspaceCommands:Jn.map((K)=>K.id)),s(Array.isArray(G.slashCommands)?G.slashCommands:g.map((K)=>String(K?.name||"").trim()).filter(Boolean))}catch(h){r?.(String(h?.message||h),"error")}finally{x(!1)}},[r]);P(()=>{$()},[$]);let v=X(()=>Jo(c),[c]),W=X(()=>Jo(t),[t]),w=X(()=>Jn.filter((h)=>Oo(n,h.label,h.description,...h.keywords||[])),[n]),k=X(()=>_.filter((h)=>Oo(n,h?.name,h?.description,h?.source)),[_,n]),R=z((h)=>{o((T)=>{let G=new Set((Array.isArray(T)?T:[]).map((g)=>String(g||"").trim()).filter(Boolean));if(G.has(h))G.delete(h);else G.add(h);return Jn.map((g)=>g.id).filter((g)=>G.has(g))})},[]),j=z((h)=>{s((T)=>{let G=new Set((Array.isArray(T)?T:[]).map((g)=>String(g||"").trim()).filter(Boolean));if(G.has(h))G.delete(h);else G.add(h);return _.map((g)=>String(g?.name||"").trim()).filter((g)=>g&&G.has(g))})},[_]),d=z(()=>{o(Jn.map((h)=>h.id)),s(_.map((h)=>String(h?.name||"").trim()).filter(Boolean))},[_]),M=z(async()=>{if(f)return;y(!0),r?.("Saving quick actions…","info");try{let h=await bi({workspaceCommands:c,slashCommands:t}),T=_r(h?.settings);i?.({quickActions:T}),window.dispatchEvent(new CustomEvent("piclaw:quick-actions-settings-updated",{detail:{settings:T}})),r?.("Quick Actions saved.","success")}catch(h){r?.(String(h?.message||h),"error")}finally{y(!1)}},[i,f,r,t,c]);if(e)return u`<div class="settings-loading">Loading…</div>`;return u`
        <div class="settings-section">
            <h3>Timeline Quick Actions</h3>
            <p class="settings-hint">
                Choose which actions appear in the timeline typeahead. Agents are always pinned first, then workspace commands, then slash commands.
            </p>

            <div class="settings-row" style="align-items:center; gap:10px; margin-bottom:12px;">
                <button class="settings-addon-btn" onClick=${d} disabled=${f}>Enable all</button>
                <button class="settings-addon-btn settings-addon-btn-install" onClick=${M} disabled=${f}>
                    ${f?"Saving…":"Save & apply"}
                </button>
            </div>

            <h3 style="margin-top:8px;">Workspace commands</h3>
            <div class="settings-subsection-list">
                ${w.map((h)=>{let T=v?v.has(h.id.toLowerCase()):!0;return u`
                        <label class="settings-checkbox-row" key=${h.id}>
                            <input type="checkbox" checked=${T} onChange=${()=>R(h.id)} />
                            <div>
                                <div>${h.label}</div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${h.description}</div>
                            </div>
                        </label>
                    `})}
                ${w.length===0&&u`<div class="settings-hint">No workspace commands match this filter.</div>`}
            </div>

            <h3 style="margin-top:20px;">Slash commands</h3>
            <div class="settings-subsection-list">
                ${k.map((h)=>{let T=String(h?.name||"").trim(),G=W?W.has(T.toLowerCase()):!0;return u`
                        <label class="settings-checkbox-row" key=${T}>
                            <input type="checkbox" checked=${G} onChange=${()=>j(T)} />
                            <div>
                                <div><code>${T}</code></div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${h?.description||"slash command"}</div>
                            </div>
                        </label>
                    `})}
                ${k.length===0&&u`<div class="settings-hint">No slash commands match this filter.</div>`}
            </div>
        </div>
    `}var So=C(()=>{E();pn();Yo()});var ao={};nn(ao,{KeychainSection:()=>t_});function c_(n){if(!n)return"—";try{return new Date(n).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"})}catch{return n}}function t_({filter:n=""}){let[r,i]=p([]),[c,o]=p(!0),[t,s]=p(null),[_,l]=p(!1),[e,x]=p(""),[f,y]=p(""),[$,v]=p(""),[W,w]=p(""),[k,R]=p(""),[j,d]=p("secret"),[M,h]=p(!1),[T,G]=p({}),[g,K]=p(null),[H,b]=p(null),[B,N]=p(null),A=Q(null),Y=Q(null),yn=Q(null),cn=z(async()=>{o(!0),s(null);try{let V=await(await fetch("/agent/keychain")).json();if(V?.ok)i(V.entries||[]);else s(V?.error||"Failed to load keychain.")}catch(F){s("Failed to load keychain.")}finally{o(!1)}},[]);P(()=>{cn()},[cn]);let Bn=z(async()=>{let F=e.trim(),V=f;if(!F||!V)return;h(!0);try{let tn=await(await fetch("/agent/keychain",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:F,secret:V,type:j,username:$.trim()||void 0,userNote:W,agentNote:k})})).json();if(tn?.ok)x(""),y(""),v(""),w(""),R(""),d("secret"),l(!1),await cn();else s(tn?.error||"Failed to add entry.")}catch{s("Failed to add entry.")}finally{h(!1)}},[e,f,$,W,k,j,cn]),Ln=z(async(F)=>{try{let m=await(await fetch("/agent/keychain",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:F})})).json();if(m?.ok)b(null),N((tn)=>tn?.name===F?null:tn),await cn();else s(m?.error||"Failed to delete entry.")}catch{s("Failed to delete entry.")}},[cn]),Gn=z(async(F)=>{let V=F?.name;if(!V)return;let m=T[V]||{},tn=Object.prototype.hasOwnProperty.call(m,"userNote")?m.userNote:F.userNote||"",un=Object.prototype.hasOwnProperty.call(m,"agentNote")?m.agentNote:F.agentNote||"";K(V);try{let Fn=await(await fetch("/agent/keychain/notes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:V,userNote:tn,agentNote:un})})).json();if(Fn?.ok)G((gr)=>{let Sn={...gr||{}};return delete Sn[V],Sn}),await cn();else s(Fn?.error||"Failed to save notes.")}catch{s("Failed to save notes.")}finally{K(null)}},[T,cn]),D=z((F,V,m)=>{G((tn)=>({...tn||{},[F]:{...(tn||{})[F]||{},[V]:m}}))},[]),q=z(async(F,V,m)=>{try{let un=await(await fetch("/agent/keychain/reveal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:F,master_password:V||void 0,totp_code:m||void 0})})).json();if(un?.ok)N({name:F,phase:"revealed",secret:un.secret,username:un.username,masterPassword:V});else if(un?.needs_master_password)N((fn)=>({name:F,phase:"password",masterPassword:"",error:fn?.name===F&&fn?.masterPassword?un.error:null})),requestAnimationFrame(()=>Y.current?.focus());else if(un?.needs_totp)N((fn)=>({name:F,phase:"totp",masterPassword:V,totpCode:"",error:fn?.name===F&&fn?.phase==="totp"&&fn?.totpCode?un.error:null})),requestAnimationFrame(()=>yn.current?.focus());else N({name:F,phase:"error",error:un?.error||"Failed to reveal."})}catch{N({name:F,phase:"error",error:"Failed to reveal."})}},[]),Tn=z((F)=>{if(B?.name===F&&B?.phase==="revealed"){N(null);return}q(F,null,null)},[B,q]),er=z((F)=>{let V=B?.masterPassword||"";if(!V)return;q(F,V,null)},[B,q]),U=z((F)=>{let V=B?.totpCode||"";if(V.length<6)return;q(F,B?.masterPassword,V)},[B,q]),O=z(async(F)=>{try{await navigator.clipboard.writeText(F)}catch{let V=document.createElement("textarea");V.value=F,V.style.position="fixed",V.style.opacity="0",document.body.appendChild(V),V.select(),document.execCommand("copy"),document.body.removeChild(V)}},[]);P(()=>{if(_)requestAnimationFrame(()=>A.current?.focus())},[_]);let rn=n.toLowerCase(),xn=X(()=>{if(!rn)return r;return r.filter((F)=>F.name.toLowerCase().includes(rn)||(F.type||"").toLowerCase().includes(rn)||(F.envVar||"").toLowerCase().includes(rn)||(F.userNote||"").toLowerCase().includes(rn)||(F.agentNote||"").toLowerCase().includes(rn))},[r,rn]);if(c)return u`<div class="settings-section"><div class="settings-loading">Loading keychain…</div></div>`;return u`
        <div class="settings-section">
            ${t&&u`
                <div class="settings-keychain-error" role="alert">
                    ${t}
                    <button class="settings-keychain-dismiss" onClick=${()=>s(null)}>✕</button>
                </div>
            `}
            <div class="settings-keychain-toolbar" style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <span class="settings-hint" style="margin:0; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span>${xn.length} entr${xn.length===1?"y":"ies"}${rn?` matching "${n}"`:""}, encrypted at rest.</span>
                    <span style="display:inline-flex; align-items:center; gap:6px;">
                        <span>Click</span>
                        <span aria-hidden="true" style="display:inline-flex; width:18px; height:18px; align-items:center; justify-content:center; border-radius:999px; border:1px solid var(--border-color, rgba(120,120,120,.22)); background:var(--panel-bg, rgba(255,255,255,.04));">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </span>
                        <span>to reveal.</span>
                    </span>
                </span>
                <button class="settings-keychain-add-btn" onClick=${()=>l(!_)}>
                    ${_?"Cancel":"+ Add entry"}
                </button>
            </div>

            ${_&&u`
                <div class="settings-keychain-add-form">
                    <div class="settings-keychain-add-row">
                        <input ref=${A} type="text" placeholder="Entry name (e.g. github/my-token)"
                            value=${e} onInput=${(F)=>x(F.target.value)}
                            class="settings-keychain-input" />
                        <select value=${j} onChange=${(F)=>d(F.target.value)}
                            class="settings-keychain-select">
                            ${o_.map((F)=>u`<option value=${F}>${F}</option>`)}
                        </select>
                    </div>
                    <div class="settings-keychain-add-row">
                        <input type="password" placeholder="Secret value"
                            value=${f} onInput=${(F)=>y(F.target.value)}
                            class="settings-keychain-input settings-keychain-secret" />
                        <input type="text" placeholder="Username (optional)"
                            value=${$} onInput=${(F)=>v(F.target.value)}
                            class="settings-keychain-input" style="max-width:200px" />
                        <button class="settings-keychain-save-btn" onClick=${Bn}
                            disabled=${M||!e.trim()||!f}>
                            ${M?"Saving…":"Save"}
                        </button>
                    </div>
                    <div class="settings-keychain-add-row" style="align-items:stretch">
                        <textarea placeholder="User note (visible in this UI only)"
                            value=${W} onInput=${(F)=>w(F.target.value)}
                            class="settings-keychain-input" rows="2" style="resize:vertical; min-height:56px"></textarea>
                        <textarea placeholder="Agent note (safe to expose to agents)"
                            value=${k} onInput=${(F)=>R(F.target.value)}
                            class="settings-keychain-input" rows="2" style="resize:vertical; min-height:56px"></textarea>
                    </div>
                </div>
            `}

            <div class="settings-keychain-table-wrap">
                <table class="settings-table settings-keychain-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Env var</th>
                            <th>Updated</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${xn.length===0&&u`
                            <tr><td colspan="5" class="settings-keychain-empty">
                                ${rn?"No entries match the filter.":"No keychain entries."}
                            </td></tr>
                        `}
                        ${xn.map((F)=>{let V=B?.name===F.name?B:null,m=V?.phase==="revealed",tn=V?.phase==="password",un=V?.phase==="totp",fn=V?.phase==="error",Fn=T[F.name]||{},gr=Object.prototype.hasOwnProperty.call(Fn,"userNote")?Fn.userNote:F.userNote||"",Sn=Object.prototype.hasOwnProperty.call(Fn,"agentNote")?Fn.agentNote:F.agentNote||"",yt=gr!==(F.userNote||"")||Sn!==(F.agentNote||""),ai=g===F.name;return u`
                            <tr class="settings-keychain-row" key=${F.name}>
                                <td class="settings-keychain-name">${F.name}</td>
                                <td><span class="settings-keychain-type-badge">${F.type}</span></td>
                                <td class="settings-keychain-env">${F.envVar?u`<code>$${F.envVar}</code>`:"—"}</td>
                                <td class="settings-keychain-date">${c_(F.updatedAt)}</td>
                                <td class="settings-keychain-actions">
                                    <button class=${`settings-keychain-reveal-btn${m?" active":""}`}
                                        onClick=${()=>Tn(F.name)}
                                        title=${m?"Hide secret":"Reveal secret"}>
                                        ${m?u`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:u`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                                    </button>
                                    ${H===F.name?u`
                                            <span class="settings-keychain-confirm">Delete?
                                                <button class="settings-keychain-confirm-yes" onClick=${()=>Ln(F.name)}>Yes</button>
                                                <button class="settings-keychain-confirm-no" onClick=${()=>b(null)}>No</button>
                                            </span>
                                        `:u`<button class="settings-keychain-delete-btn" onClick=${()=>b(F.name)} title="Delete">🗑</button>`}
                                </td>
                            </tr>
                            <tr class="settings-keychain-notes-row" key=${F.name+"-notes"}>
                                <td colspan="5">
                                    <div style="display:grid; grid-template-columns:1fr 1fr auto; gap:8px; align-items:start; padding:8px 0 10px 0;">
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">User note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Human/UI note only"
                                                value=${gr}
                                                onInput=${(sn)=>D(F.name,"userNote",sn.target.value)}></textarea>
                                        </label>
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">Agent-readable note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Safe guidance for agents"
                                                value=${Sn}
                                                onInput=${(sn)=>D(F.name,"agentNote",sn.target.value)}></textarea>
                                        </label>
                                        <button class="settings-keychain-save-btn" style="margin-top:20px" disabled=${!yt||ai} onClick=${()=>Gn(F)}>
                                            ${ai?"Saving…":"Save notes"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ${tn&&u`
                                <tr class="settings-keychain-prompt-row" key=${F.name+"-pw"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">Master password:</span>
                                            <input ref=${Y} type="password" autocomplete="off"
                                                placeholder="Enter keychain master password"
                                                class="settings-keychain-prompt-input"
                                                value=${V?.masterPassword||""}
                                                onInput=${(sn)=>N((qr)=>({...qr,masterPassword:sn.target.value}))}
                                                onKeyDown=${(sn)=>{if(sn.key==="Enter")er(F.name);if(sn.key==="Escape")N(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>er(F.name)}
                                                disabled=${!V?.masterPassword}>Unlock</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>N(null)}>Cancel</button>
                                            ${V?.error&&u`<span class="settings-keychain-prompt-error">${V.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${un&&u`
                                <tr class="settings-keychain-prompt-row" key=${F.name+"-totp"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">TOTP code:</span>
                                            <input ref=${yn} type="text" inputmode="numeric" autocomplete="one-time-code"
                                                maxlength="6" placeholder="000000"
                                                class="settings-keychain-prompt-input" style="width:90px;text-align:center;letter-spacing:0.15em"
                                                value=${V?.totpCode||""}
                                                onInput=${(sn)=>N((qr)=>({...qr,totpCode:sn.target.value.replace(/\\D/g,"").slice(0,6)}))}
                                                onKeyDown=${(sn)=>{if(sn.key==="Enter")U(F.name);if(sn.key==="Escape")N(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>U(F.name)}
                                                disabled=${(V?.totpCode||"").length<6}>Verify</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>N(null)}>Cancel</button>
                                            ${V?.error&&u`<span class="settings-keychain-prompt-error">${V.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${m&&u`
                                <tr class="settings-keychain-reveal-row" key=${F.name+"-reveal"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel">
                                            ${V.username&&u`
                                                <div class="settings-keychain-reveal-field">
                                                    <span class="settings-keychain-reveal-label">Username</span>
                                                    <code class="settings-keychain-reveal-value">${V.username}</code>
                                                    <button class="settings-keychain-copy-btn" onClick=${()=>O(V.username)} title="Copy username">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                    </button>
                                                </div>
                                            `}
                                            <div class="settings-keychain-reveal-field">
                                                <span class="settings-keychain-reveal-label">Secret</span>
                                                <code class="settings-keychain-reveal-value">${V.secret}</code>
                                                <button class="settings-keychain-copy-btn" onClick=${()=>O(V.secret)} title="Copy secret">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${fn&&u`
                                <tr class="settings-keychain-reveal-row" key=${F.name+"-error"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel" style="color: var(--error-color, #e55)">${V.error}</div>
                                    </td>
                                </tr>
                            `}
                        `})}
                    </tbody>
                </table>
            </div>
        </div>
    `}var o_;var mo=C(()=>{E();o_=["secret","token","password","basic"]});var nt={};nn(nt,{ToolsSection:()=>f_});function f_({toolsets:n,filter:r="",settingsData:i,mergeSettingsData:c}){let o=n||[],[t,s]=p(()=>{let y={};for(let $ of o)y[$.name]=!0;return y}),_=z((y)=>{s(($)=>({...$,[y]:!$[y]}))},[]),l=i?.searchMatchMode||"or",e=z(async()=>{let y=l==="or"?"and":"or";try{let v=await(await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({searchMatchMode:y})})).json().catch(()=>({}));if(v?.ok&&v?.settings)c?.(v.settings)}catch($){console.warn("[settings/tools] Failed to save search match mode.",$)}},[l,c]),x=r.toLowerCase(),f=X(()=>{if(!x)return o;return o.map((y)=>{let $=y.tools.filter((v)=>v.name.toLowerCase().includes(x)||y.name.toLowerCase().includes(x)||(v.summary||"").toLowerCase().includes(x));return $.length>0?{...y,tools:$}:null}).filter(Boolean)},[o,x]);if(o.length===0)return u`<div class="settings-section"><p class="settings-hint">Tool data not available.</p></div>`;return u`
        <div class="settings-section">
            <div class="settings-search-options">
                <h4 style="margin:0 0 8px 0">Search</h4>
                <div class="settings-row">
                    <label>Match mode</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" checked=${l==="and"} onChange=${e} />
                        <span class="settings-hint" style="margin:0">
                            ${l==="or"?"Any keyword (OR) — results match at least one search term":"All keywords (AND) — results must match every search term"}
                        </span>
                    </div>
                </div>
            </div>
            ${f.map((y)=>{let $=t[y.name]!==!1;return u`
                <div class="settings-toolset">
                    <div class="settings-toolset-header">
                        <label class="settings-toolset-toggle">
                            <input type="checkbox" checked=${$} onChange=${()=>_(y.name)} />
                            <span class="settings-toolset-icon">${s_[y.name]||l_}</span>
                            <strong>${y.name}</strong>
                        </label>
                        <span class="settings-hint" style="margin:0">${y.description}</span>
                    </div>
                    ${$&&u`<div class="settings-tool-list">${y.tools.map((v)=>u`
                        <div class="settings-tool-row">
                            <input type="checkbox" checked disabled />
                            <span class="settings-tool-name">${v.name}</span>
                            <span class="settings-tool-kind" title=${v.kind}>${__[v.kind]||"?"}</span>
                            ${v.summary&&u`<span class="settings-tool-summary">${v.summary}</span>`}
                            <span class="settings-tool-source">${u_[v.name]||y.name}</span>
                        </div>
                    `)}</div>`}
                </div>
            `})}
            ${f.length===0&&u`<p class="settings-hint">No tools match "${r}"</p>`}
            <p class="settings-hint">Tool activation is managed by the agent runtime. Group checkboxes collapse/expand; individual tools use <code>activate_tools</code>.</p>
        </div>
    `}var s_,u_,__,l_;var rt=C(()=>{E();s_={core:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M7.5 10l2.5 2-2.5 2"/><path d="M12.5 15H16"/></svg>`,discovery:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,attachments:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,"model-control":u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M9 15c.83.67 2 1 3 1s2.17-.33 3-1"/></svg>`,data:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,workspace:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,automation:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,remote:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,browser:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,ui:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,experiments:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v7l4.6 7.7A1 1 0 0 1 18.7 19H5.3a1 1 0 0 1-.9-1.3L9 10z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>`,lifecycle:u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`},u_={read:"pi-core",write:"pi-core",edit:"pi-core",bash:"pi-core",powershell:"pi-core",find:"pi-core",grep:"pi-core",ls:"pi-core",list_tools:"internal-tools",activate_tools:"tool-activation",reset_active_tools:"tool-activation",list_scripts:"runtime-scripts",attach_file:"file-attachments",read_attachment:"file-attachments",export_attachment:"file-attachments",get_model_state:"model-control",list_models:"model-control",switch_model:"model-control",switch_thinking:"model-control",messages:"messages-crud",introspect_sql:"sql-introspect",keychain:"keychain-tools",search_workspace:"workspace-search",refresh_workspace_index:"workspace-search",open_office_viewer:"office-viewer",office_read:"office-viewer",office_write:"office-viewer",open_workspace_file:"open-workspace-file",image_process:"image-processing",schedule_task:"scheduled-tasks",scheduled_tasks:"scheduled-tasks",bun_run:"bun-runner",exec_batch:"exec-batch",search_tool_output:"search-tool-output",ssh:"ssh",proxmox:"proxmox",portainer:"portainer",mcp:"mcp",cdp_browser:"cdp-browser",send_adaptive_card:"send-adaptive-card",send_dashboard_widget:"send-dashboard-widget",start_autoresearch:"autoresearch",stop_autoresearch:"autoresearch",autoresearch_status:"autoresearch",exit_process:"exit-process",env:"env-tools"},__={"read-only":"\uD83D\uDD0D",mutating:"✏️",mixed:"\uD83D\uDD04"},l_=u`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`});var it={};nn(it,{AddonsSection:()=>e_});function e_({setStatus:n,filter:r=""}){let[i,c]=p(null),[o,t]=p(!0),[s,_]=p(null),[l,e]=p(!1),[x,f]=p({runtime:"",windowsNative:!1}),[y,$]=p([]),[v,W]=p([]);function w(){let g=new URLSearchParams;try{let H=(localStorage.getItem("piclaw_addons_catalog_url")||"").trim(),b=(localStorage.getItem("piclaw_addons_catalog_urls")||"").split(/\r?\n/).map((N)=>N.trim()).filter(Boolean),B=localStorage.getItem("piclaw_addons_repo_url");if(H)g.append("catalog_url",H);for(let N of b)g.append("catalog_url",N);if(B)g.set("repo_url",B)}catch(H){}let K=g.toString();return K?`?${K}`:""}let k=z(async()=>{try{let[g,K]=await Promise.all([fetch(`/agent/addons${w()}`),fetch("/agent/settings-data")]),H=await g.json();if(H.error)throw Error(H.error);c(H.addons||[]),$(H.sources||[]),W(H.failed_sources||[]);let b=await K.json().catch(()=>({})),B=typeof b?.runtimePlatform==="string"?b.runtimePlatform:"";f({runtime:B,windowsNative:B==="win32"})}catch(g){c(null),n?.(String(g.message||g),"error")}finally{t(!1)}},[n]);P(()=>{k()},[]);let R=z(async(g)=>{if(s)return;_({slug:g,action:"install"}),n?.(`Installing ${g}…`,"info");try{let H=await(await fetch(`/agent/addons/install${w()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:g})})).json();if(H.error){n?.(H.error,"error");return}e(!0);let b=[H.message,H.warning].filter(Boolean).join(" ");n?.(b||"Add-on installed.","success"),await k()}catch(K){n?.(String(K.message||K),"error")}finally{_(null)}},[s,k,n]),j=z(async(g)=>{if(s)return;_({slug:g,action:"remove"}),n?.(`Removing ${g}…`,"info");try{let H=await(await fetch(`/agent/addons/uninstall${w()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:g})})).json();if(H.error){n?.(H.error,"error");return}e(!0);let b=[H.message,H.warning].filter(Boolean).join(" ");n?.(b||"Add-on removed.","success"),await k()}catch(K){n?.(String(K.message||K),"error")}finally{_(null)}},[s,k,n]),d=z(async()=>{if(s)return;_({slug:null,action:"restart"}),n?.("Restarting piclaw…","info");try{let K=await(await fetch("/agent/addons/restart",{method:"POST"})).json();if(K.error){n?.(K.error,"error"),_(null);return}n?.(K.message||"Restarting piclaw…","success"),e(!1),(async(b=30,B=2000)=>{for(let N=0;N<b;N++){await new Promise((A)=>setTimeout(A,B));try{if((await fetch("/agent/addons",{signal:AbortSignal.timeout(3000)})).ok){await k(),_(null),n?.("Restart complete — add-ons refreshed.","success");return}}catch(A){}}_(null),n?.("Backend did not return in time. Reload the page manually.","warning")})()}catch(g){n?.(String(g.message||g),"error"),_(null)}},[s,n,k]);if(o)return u`<div class="settings-loading">Fetching add-ons\u2026</div>`;if(!i)return u`<div class="settings-section"><p class="settings-hint">Could not load add-ons.</p></div>`;let M=r.toLowerCase(),h=M?i.filter((g)=>g.slug.toLowerCase().includes(M)||(g.description||"").toLowerCase().includes(M)||(g.tags||[]).some((K)=>K.toLowerCase().includes(M))):i,T=s?.slug||null,G=s?s.action==="remove"?`Removing ${s.slug}…`:s.action==="restart"?"Restarting piclaw…":`Installing ${s.slug}…`:"";return u`
        <div class=${`settings-section settings-addon-panel${s?" busy":""}`} aria-busy=${s?"true":"false"}>
            <div class="settings-addon-toolbar">
                <div>
                    <p class="settings-hint">
                        ${y.length<=1?u`Catalog from <a href="https://github.com/rcarmo/piclaw-addons" target="_blank">rcarmo/piclaw-addons</a>.`:u`${y.length} catalog sources merged.`}
                        ${" "}Package-first install via Bun; restart required after install/uninstall.
                    </p>
                    ${v.length>0&&u`
                        <div class="settings-addon-error" role="alert">
                            Failed to fetch ${v.length} catalog source${v.length>1?"s":""}:
                            ${v.map((g)=>u` <code style="font-size:0.82em;word-break:break-all">${g}</code>`)}
                        </div>
                    `}
                    ${y.length>1&&u`
                        <details class="settings-hint" style="margin-top:4px">
                            <summary style="cursor:pointer">Active catalog sources (${y.length})</summary>
                            <ul style="margin:4px 0 0 16px;font-size:0.82em">
                                ${y.map((g)=>u`<li style="word-break:break-all"><code>${g}</code></li>`)}
                            </ul>
                        </details>
                    `}
                    ${x.windowsNative&&u`
                        <div class="settings-addon-error" role="alert">
                            Native Windows add-on installs are higher risk: Bun package installs, symlink cleanup, locked files, and restart timing can all be less predictable than in Linux/WSL. Prefer WSL or a container when possible.
                        </div>
                    `}
                </div>
            </div>
            <div class="settings-addon-list">
                ${s&&u`
                    <div class="settings-addon-panel-overlay" role="status" aria-live="polite" aria-label=${G}>
                        <div class="settings-addon-panel-overlay-card">
                            <div class="settings-spinner"></div>
                            <span>${G}</span>
                        </div>
                    </div>
                `}
                ${h.map((g)=>{let K=(g.skills||[]).length>0,H=g.type==="extension",b=K&&H?"extension + skill":K?"skill":"extension",B=K&&!H?"settings-tag-skill":"",N=typeof g.homepage==="string"&&g.homepage.trim()?g.homepage.trim():"";return u`
                    <div class=${`settings-addon-card${g.installed?" installed":""}`}>
                        <div class="settings-addon-card-header">
                            ${N?u`<a class="settings-addon-name-link" href=${N} target="_blank" rel="noopener noreferrer">${g.slug}</a>`:u`<strong>${g.slug}</strong>`}
                            <span class=${`settings-tag settings-tag-type ${B}`}>${b}</span>
                            <span class="settings-addon-version">${g.installed?g.installedVersion||"?":g.version||""}</span>
                            ${g.installKind&&u`<span class="settings-tag">${g.installKind}</span>`}
                            ${g.hasUpdate&&u`<span class="settings-tag settings-tag-skill">\u2191 ${g.version}</span>`}
                            <div class="settings-addon-actions">
                                ${g.installed?u`
                                    ${g.hasUpdate&&u`<button class="settings-addon-btn settings-addon-btn-upgrade" disabled=${Boolean(s)} onClick=${()=>R(g.slug)}>${T===g.slug?"…":"Update"}</button>`}
                                    <button class="settings-addon-btn settings-addon-btn-remove" disabled=${Boolean(s)} onClick=${()=>j(g.slug)}>${T===g.slug?"…":"Remove"}</button>
                                `:u`
                                    <button class="settings-addon-btn settings-addon-btn-install" disabled=${Boolean(s)} onClick=${()=>R(g.slug)}>${T===g.slug?"…":"Install"}</button>
                                `}
                            </div>
                        </div>
                        <div class="settings-addon-card-body">${g.description}</div>
                        <div class="settings-addon-card-footer">
                            <div class="settings-addon-tags">${(g.tags||[]).map((A)=>u`<span class="settings-tag">${A}</span>`)}${(g.skills||[]).map((A)=>u`<span class="settings-tag settings-tag-skill">\ud83d\udcdd ${A}</span>`)}</div>
                        </div>
                    </div>
                `})}
                ${h.length===0&&u`<p class="settings-hint">No add-ons match "${r}"</p>`}
            </div>
            ${l&&u`
                <div class="settings-addon-restart-notice" role="status" aria-live="polite">
                    <span>Extension changes are installed but inactive until piclaw restarts.</span>
                    <button class="settings-addon-btn settings-addon-btn-restart-now" type="button" disabled=${Boolean(s)} onClick=${d}>Restart Now</button>
                </div>
            `}
        </div>
    `}var ct=C(()=>{E()});var x_={};function Yi(n,r){try{let i=localStorage.getItem(n);return i===null?r:i==="true"}catch{return r}}function Vr(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function g_(n,r){try{return localStorage.getItem(n)||r}catch{return r}}function p_(n,r){try{localStorage.setItem(n,r)}catch(i){}}function $_(n,r,i,c){try{return $n(localStorage.getItem(n),{fallback:r,min:i,max:c})}catch{return $n(r,{fallback:r,min:i,max:c})}}function h_(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function w_(){let[n,r]=p(()=>Yi("piclaw_vim_mode",!1)),[i,c]=p(()=>Yi("piclaw_show_whitespace",!0)),[o,t]=p(()=>Yi("piclaw_md_live_preview",!0)),[s,_]=p(()=>$_("piclaw_editor_font_size",13,10,24)),[l,e]=p(()=>g_("piclaw_editor_font_family","")),x=z((f,y,$)=>{let v=!y;$(v),Vr(f,v)},[]);return u`
        <div class="settings-section">
            <h3>Editor</h3>
            <div class="settings-row">
                <label>Vim mode</label>
                <input type="checkbox" checked=${n}
                    onChange=${()=>{let f=!n;r(f),Vr("piclaw_vim_mode",f)}} />
            </div>
            <div class="settings-row">
                <label>Show whitespace</label>
                <input type="checkbox" checked=${i}
                    onChange=${()=>{let f=!i;c(f),Vr("piclaw_show_whitespace",f)}} />
            </div>
            <div class="settings-row">
                <label>Markdown live preview</label>
                <input type="checkbox" checked=${o}
                    onChange=${()=>{let f=!o;t(f),Vr("piclaw_md_live_preview",f)}} />
            </div>
            <div class="settings-row">
                <label>Font size (px)</label>
                <${S}
                    label="editor font size"
                    value=${s}
                    min=${10}
                    max=${24}
                    fallback=${13}
                    width="70px"
                    onChange=${(f)=>{_(f),h_("piclaw_editor_font_size",f)}}
                />
            </div>
            <div class="settings-row">
                <label>Font family</label>
                <input type="text" value=${l}
                    onInput=${(f)=>{let y=f.target.value;e(y),p_("piclaw_editor_font_family",y)}}
                    placeholder="monospace (default)" />
            </div>
            <p class="settings-hint settings-local-only-hint">This browser only. Editor changes are stored in local browser storage and take effect when you next open or reload a file tab.</p>
        </div>
    `}var y_;var ot=C(()=>{E();Qn();Rn();y_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;kn({id:"editor",label:"Editor",icon:y_,component:w_,order:150})});var B_={};function tt(n,r){try{let i=localStorage.getItem(n);return i===null?r:i==="true"}catch{return r}}function st(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function b_(n,r,i,c){try{return $n(localStorage.getItem(n),{fallback:r,min:i,max:c})}catch{return $n(r,{fallback:r,min:i,max:c})}}function v_(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function k_(){let[n,r]=p(()=>tt("piclaw_mindmap_auto_expand",!0)),[i,c]=p(()=>b_("piclaw_mindmap_node_spacing",40,20,100)),[o,t]=p(()=>tt("piclaw_mindmap_animate",!0));return u`
        <div class="settings-section">
            <h3>Mind Map</h3>
            <div class="settings-row">
                <label>Auto-expand nodes</label>
                <input type="checkbox" checked=${n}
                    onChange=${()=>{let s=!n;r(s),st("piclaw_mindmap_auto_expand",s)}} />
            </div>
            <div class="settings-row">
                <label>Node spacing (px)</label>
                <${S}
                    label="node spacing"
                    value=${i}
                    min=${20}
                    max=${100}
                    fallback=${40}
                    width="70px"
                    onChange=${(s)=>{c(s),v_("piclaw_mindmap_node_spacing",s)}}
                />
            </div>
            <div class="settings-row">
                <label>Animate transitions</label>
                <input type="checkbox" checked=${o}
                    onChange=${()=>{let s=!o;t(s),st("piclaw_mindmap_animate",s)}} />
            </div>
            <p class="settings-hint settings-local-only-hint">This browser only. Opens <code>.mindmap.yaml</code> files. Changes take effect on the next map open.</p>
        </div>
    `}var d_;var ut=C(()=>{E();Qn();Rn();d_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="9.5" y1="9.5" x2="6.5" y2="6.5"/><line x1="14.5" y1="9.5" x2="17.5" y2="6.5"/><line x1="9.5" y1="14.5" x2="6.5" y2="17.5"/><line x1="14.5" y1="14.5" x2="17.5" y2="17.5"/></svg>`;kn({id:"mindmap",label:"Mind Map",icon:d_,component:k_,order:170})});var z_={};function Oi(n,r){try{let i=localStorage.getItem(n);return i===null?r:i==="true"}catch{return r}}function Ji(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function Ei(n,r){try{return localStorage.getItem(n)||r}catch{return r}}function Si(n,r){try{localStorage.setItem(n,r)}catch(i){}}function T_(){let[n,r]=p(()=>Oi("piclaw_dev_mode",!1)),[i,c]=p(()=>Ei("piclaw_addons_catalog_url","")),[o,t]=p(()=>Ei("piclaw_addons_catalog_urls","")),[s,_]=p(()=>Ei("piclaw_addons_repo_url","")),[l,e]=p(()=>Oi("piclaw_debug_sse",!1)),[x,f]=p(()=>Oi("piclaw_debug_tool_calls",!1)),y=z(()=>{let $=!n;r($),Ji("piclaw_dev_mode",$)},[n]);return u`
        <div class="settings-section">
            <h3>Developer</h3>
            <div class="settings-row">
                <label>Developer mode</label>
                <input type="checkbox" checked=${n} onChange=${y} />
            </div>

            <p class="settings-hint settings-local-only-hint">This browser only. Developer-mode toggles and add-on catalog overrides are stored in local browser storage.</p>

            ${n&&u`
                <h3 style="margin-top:16px">Add-on Sources</h3>
                <div class="settings-row">
                    <label>Catalog URL</label>
                    <input type="text" value=${i}
                        onInput=${($)=>{let v=$.target.value;c(v),Si("piclaw_addons_catalog_url",v)}}
                        placeholder="https://raw.githubusercontent.com/.../catalog.json" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Primary add-on catalog URL. Leave empty to use the default (<code>rcarmo/piclaw-addons</code>).</p>
                <div class="settings-row" style="align-items:flex-start;">
                    <label>Additional catalog URLs</label>
                    <textarea
                        value=${o}
                        onInput=${($)=>{let v=$.target.value;t(v),Si("piclaw_addons_catalog_urls",v)}}
                        placeholder="One URL per line\nhttps://example.com/catalog.json"
                        style="max-width:400px; min-height:86px; resize:vertical;"
                    ></textarea>
                </div>
                <p class="settings-hint" style="margin-top:0">Fetched in addition to the primary/default catalog. One URL per line.</p>
                <div class="settings-row">
                    <label>Repo URL</label>
                    <input type="text" value=${s}
                        onInput=${($)=>{let v=$.target.value;_(v),Si("piclaw_addons_repo_url",v)}}
                        placeholder="https://github.com/.../piclaw-addons.git" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Override the git repo used for <code>bun add</code> installs. Leave empty for default.</p>

                <h3 style="margin-top:16px">Debug</h3>
                <div class="settings-row">
                    <label>Log SSE events</label>
                    <input type="checkbox" checked=${l}
                        onChange=${()=>{let $=!l;e($),Ji("piclaw_debug_sse",$)}} />
                </div>
                <div class="settings-row">
                    <label>Log tool calls</label>
                    <input type="checkbox" checked=${x}
                        onChange=${()=>{let $=!x;f($),Ji("piclaw_debug_tool_calls",$)}} />
                </div>
                <p class="settings-hint">Debug flags take effect on next page reload.</p>
            `}
        </div>
    `}var F_;var _t=C(()=>{E();Qn();F_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;kn({id:"developer",label:"Developer",icon:F_,component:T_,order:900})});var O_={};nn(O_,{openSettingsDialog:()=>Y_,SettingsDialogContent:()=>Cr,SettingsDialog:()=>Z_});function fr(n){lr.push({ts:performance.now(),label:n})}function K_(){if(!lr.length)return;let n=lr[0].ts,r=lr.map((i)=>`+${(i.ts-n).toFixed(1)}ms ${i.label}`);console.info(`[settings-dialog perf]
`+r.join(`
`));try{window.__piclawSettingsPerfLog=r}catch(i){}try{fetch("/agent/client-perf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({label:"settings-dialog",lines:r})}).catch((i)=>{})}catch(i){}lr.length=0}function N_(n){let r=Qr.get(n);if(r)return Promise.resolve(r);let i=Ar.get(n);if(i)return i;let c=W_[n]().then((o)=>{return Qr.set(n,o),Ar.delete(n),o}).catch((o)=>{throw Ar.delete(n),o});return Ar.set(n,c),c}function Xr(n="Loading…"){return u`
        <div class="settings-loading settings-loading-pane" role="status" aria-live="polite">
            <span class="settings-spinner"></span>
            <span>${n}</span>
        </div>
    `}function Cr({onClose:n}){fr("SettingsDialogContent-render-start");let[r,i]=p(()=>oi()||"general"),[c,o]=p(lt),[t,s]=p(null),[_,l]=p(""),[,e]=p(0),[x,f]=p(()=>Object.fromEntries(Qr.entries())),[y,$]=p(null),[v,W]=p({compact:!1,narrow:!1}),w=Q(null),k=Q(null);P(()=>{fr("SettingsDialogContent-mounted"),K_()},[]),P(()=>{let b=(B)=>{if(B.key==="Escape")n()};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[n]),P(()=>{let b=(B)=>{let N=typeof B?.detail?.section==="string"?B.detail.section.trim():"";if(N)i(N),l("")};return window.addEventListener("piclaw:open-settings",b),()=>window.removeEventListener("piclaw:open-settings",b)},[]),P(()=>{let b=()=>e((B)=>B+1);return window.addEventListener("piclaw:settings-panes-changed",b),()=>window.removeEventListener("piclaw:settings-panes-changed",b)},[]),P(()=>{fetch("/agent/settings-data").then((b)=>b.json()).then((b)=>{lt=b,o(b)}).catch(()=>o({}))},[]),P(()=>{let b=k.current;if(!b)return;let B=()=>{let N=b.clientWidth||0;W((A)=>{let Y={compact:N>0&&N<=860,narrow:N>0&&N<=720};return A.compact===Y.compact&&A.narrow===Y.narrow?A:Y})};if(B(),typeof ResizeObserver==="function"){let N=new ResizeObserver(()=>B());return N.observe(b),()=>N.disconnect()}return window.addEventListener("resize",B),()=>window.removeEventListener("resize",B)},[]);let R=[...et].sort((b,B)=>(b.order??500)-(B.order??500)),d=Wc().map((b)=>({id:b.id,label:b.label,icon:b.icon,searchable:b.searchable||!1,placeholder:b.searchPlaceholder,order:b.order??500,isExtension:!0,component:b.component})).sort(ci),M=[...R,...d],h=M.find((b)=>b.id===r)||et.find((b)=>b.id===r);P(()=>{if(h?.searchable)requestAnimationFrame(()=>w.current?.focus())},[r]),P(()=>{if(h?.isExtension){$(null);return}let b=!1;if(x[r]){$(null);return}return $(r),N_(r).then((B)=>{if(b)return;f((N)=>N?.[r]?N:{...N||{},[r]:B})}).catch((B)=>{if(b)return;console.error(`[settings-dialog] Failed to lazy-load section "${r}".`,B)}).finally(()=>{if(!b)$((B)=>B===r?null:B)}),()=>{b=!0}},[r,h?.isExtension,x]);let T=z((b,B="info")=>{s(b?{text:b,type:B}:null)},[]),G=z((b)=>{i(b),l("");let B=M_[b];if(B&&!ft.has(b))ft.add(b),B().then(()=>e((N)=>N+1)).catch((N)=>{})},[]),g=z((b)=>{o((B)=>({...B||{},...b||{}}))},[]),K=()=>{if(h?.isExtension){if(!h.component)return Xr("Loading pane…");let B=h.component;return u`<${B} filter=${_} />`}let b=x[r];if(!b||y===r)return Xr(`Loading ${h?.label||"settings"}…`);switch(r){case"general":return u`<${b} settingsData=${c} setStatus=${T} mergeSettingsData=${g} />`;case"sessions":return u`<${b} settingsData=${c} setStatus=${T} mergeSettingsData=${g} />`;case"compaction":return u`<${b} settingsData=${c} setStatus=${T} mergeSettingsData=${g} />`;case"keyboard":return u`<${b} filter=${_} setStatus=${T} />`;case"workspace":return u`<${b} settingsData=${c} setStatus=${T} mergeSettingsData=${g} />`;case"environment":return u`<${b} settingsData=${c} filter=${_} setStatus=${T} mergeSettingsData=${g} />`;case"providers":return u`<${b} providers=${c?.providers} setStatus=${T} />`;case"models":return u`<${b} filter=${_} />`;case"theme":return u`<${b} themes=${c?.themes} colorKeys=${c?.colorKeys} settingsData=${c} setStatus=${T} mergeSettingsData=${g} />`;case"scheduled-tasks":return u`<${b} filter=${_} setStatus=${T} />`;case"quick-actions":return u`<${b} filter=${_} setStatus=${T} mergeSettingsData=${g} />`;case"keychain":return u`<${b} filter=${_} />`;case"tools":return u`<${b} toolsets=${c?.toolsets} filter=${_} settingsData=${c} mergeSettingsData=${g} />`;case"addons":return u`<${b} setStatus=${T} filter=${_} />`;default:return Xr("Loading settings…")}},H=!h;return fr("SettingsDialogContent-render-end"),u`
        <div class="settings-dialog-backdrop" onClick=${(b)=>{if(b.target===b.currentTarget)n()}}>
            <div ref=${k} data-testid="settings-dialog" class=${`settings-dialog${v.compact?" settings-dialog-compact":""}${v.narrow?" settings-dialog-narrow":""}`}>
                <div class="settings-dialog-header">
                    <span class="settings-dialog-title">Settings</span>
                    ${h?.searchable&&u`
                        <input ref=${w} type="text" class="settings-header-filter"
                            placeholder=${h.placeholder||"Filter…"}
                            value=${_} onInput=${(b)=>l(b.target.value)} />
                    `}
                    <button class="settings-dialog-close" onClick=${n} title="Close (Esc)">✕</button>
                </div>
                <div class="settings-dialog-body">
                    <nav class="settings-nav">
                        ${M.map((b,B)=>{let N=B>0&&!M[B-1].isExtension,A=b.isExtension&&N;return u`
                                ${A&&u`<div class="settings-nav-separator"></div>`}
                                <button class=${`settings-nav-item ${b.id===r?"active":""}`} onClick=${()=>G(b.id)}>
                                    <span class="settings-nav-icon">${b.icon}</span>
                                    <span class="settings-nav-label">${b.label}</span>
                                </button>
                            `})}
                    </nav>
                    <main class="settings-content">
                        ${H?Xr("Loading settings…"):K()}
                    </main>
                </div>
                ${t&&u`
                    <div class=${`settings-status-bar settings-status-bar-${t.type}`}>
                        ${t.type==="info"&&u`<span class="settings-spinner"></span>`}
                        <span>${t.text}</span>
                        ${t.type!=="info"&&u`<button class="settings-status-dismiss" onClick=${()=>s(null)}>✕</button>`}
                    </div>
                `}
            </div>
        </div>
    `}function Z_(){let[n,r]=p(!1);if(P(()=>{let i=(o)=>{let t=Tr(o?.detail?.section);if(t)try{window.__piclawSettingsRequestedSection=t}catch(s){}r(!0)};window.addEventListener("piclaw:open-settings",i);let c=Nc();if(c.open){if(c.section)try{window.__piclawSettingsRequestedSection=c.section}catch(o){}r(!0)}return()=>window.removeEventListener("piclaw:open-settings",i)},[]),!n)return null;return u`<${zc} className="settings-portal"><${Cr} onClose=${()=>r(!1)} /><//>`}function Y_(n={}){Mc(n)}var lr,lt=null,Qr,Ar,W_,M_,ft,R_,j_,U_,H_,L_,G_,P_,V_,A_,X_,Q_,C_,q_,D_,I_,et;var gt=C(()=>{E();Kc();Qn();ac();lr=[];fr("module-eval-start");fr("imports-done");Qr=new Map,Ar=new Map;Qr.set("general",zi);W_={general:()=>Promise.resolve(zi),sessions:()=>Promise.resolve().then(() => (ro(),no)).then((n)=>n.SessionsSection),recordings:()=>Promise.resolve().then(() => (co(),io)).then((n)=>n.RecordingsSection),compaction:()=>Promise.resolve().then(() => (to(),oo)).then((n)=>n.CompactionSection),keyboard:()=>Promise.resolve().then(() => (po(),go)).then((n)=>n.KeyboardSection),workspace:()=>Promise.resolve().then(() => (Bo(),ko)).then((n)=>n.WorkspaceSection),environment:()=>Promise.resolve().then(() => (Fo(),To)).then((n)=>n.EnvironmentSection),providers:()=>Promise.resolve().then(() => (Ko(),zo)).then((n)=>n.ProvidersSection),models:()=>Promise.resolve().then(() => (Mo(),Wo)).then((n)=>n.ModelsSection),theme:()=>Promise.resolve().then(() => (Xo(),Ao)).then((n)=>n.ThemeSection),"scheduled-tasks":()=>Promise.resolve().then(() => (qo(),Co)).then((n)=>n.ScheduledTasksSection),"quick-actions":()=>Promise.resolve().then(() => (So(),Eo)).then((n)=>n.QuickActionsSection),keychain:()=>Promise.resolve().then(() => (mo(),ao)).then((n)=>n.KeychainSection),tools:()=>Promise.resolve().then(() => (rt(),nt)).then((n)=>n.ToolsSection),addons:()=>Promise.resolve().then(() => (ct(),it)).then((n)=>n.AddonsSection)},M_={"editor-settings":()=>Promise.resolve().then(() => (ot(),x_)).then(()=>{}),"mindmap-settings":()=>Promise.resolve().then(() => (ut(),B_)).then(()=>{}),developer:()=>Promise.resolve().then(() => (_t(),z_)).then(()=>{})},ft=new Set;R_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M8.5 5.9L9.6 2.3h4.8l1.1 3.6 3.7-.8 2.4 4.1-2.6 2.8 2.6 2.8-2.4 4.1-3.7-.8-1.1 3.6H9.6l-1.1-3.6-3.7.8-2.4-4.1L5 12 2.4 9.2l2.4-4.1z"/></svg>`,j_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,U_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.2"/><path d="m13 10 4-2.5v9L13 14z"/></svg>`,H_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 10 9 10"/><path d="M12 7v5l3 3"/></svg>`,L_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,G_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/><path d="M8 7v10"/><path d="M16 7v10"/></svg>`,P_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01"/><path d="M10 9h.01"/><path d="M14 9h.01"/><path d="M18 9h.01"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M7 17h10"/></svg>`,V_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,A_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none"/><line x1="12" y1="9" x2="12" y2="5"/><circle cx="12" cy="4" r="1.5"/></svg>`,X_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.53-.21-1.01-.55-1.36-.34-.36-.55-.84-.55-1.37 0-1.1.9-2 2-2h2.36c3.08 0 5.64-2.56 5.64-5.64C22.9 5.85 18.05 2 12 2z"/><circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none"/></svg>`,Q_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M7 3.5 4 6"/><path d="m17 3.5 3 2.5"/></svg>`,C_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,q_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,D_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="14" r="3"/><path d="M11 14h9"/><path d="M16 14v-2"/><path d="M19 14v2"/></svg>`,I_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,et=[{id:"general",label:"General",icon:R_,searchable:!1,order:10},{id:"sessions",label:"Sessions",icon:j_,searchable:!1,order:12},{id:"recordings",label:"Recordings",icon:U_,searchable:!0,placeholder:"Filter recordings…",order:12.5},{id:"compaction",label:"Compaction",icon:H_,searchable:!1,order:13},{id:"keyboard",label:"Keyboard",icon:P_,searchable:!0,placeholder:"Filter shortcuts…",order:14},{id:"workspace",label:"Workspace",icon:L_,searchable:!1,order:15},{id:"environment",label:"Environment",icon:G_,searchable:!0,placeholder:"Filter environment…",order:16},{id:"providers",label:"Providers",icon:V_,searchable:!1,order:20},{id:"models",label:"Models",icon:A_,searchable:!0,placeholder:"Filter models…",order:30},{id:"theme",label:"Appearance",icon:X_,searchable:!1,order:40},{id:"scheduled-tasks",label:"Scheduled Tasks",icon:Q_,searchable:!0,placeholder:"Filter scheduled tasks…",order:65},{id:"quick-actions",label:"Quick Actions",icon:q_,searchable:!0,placeholder:"Filter quick actions…",order:70},{id:"keychain",label:"Keychain",icon:D_,searchable:!0,placeholder:"Filter entries…",order:75},{id:"tools",label:"Tools",icon:C_,searchable:!0,placeholder:"Filter tools…",order:80},{id:"addons",label:"Add-ons",icon:I_,searchable:!0,placeholder:"Filter add-ons…",order:90}]});E();gt();Qn();var J_=u`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`;function E_({label:n,body:r,filter:i=""}){return u`
    <div class="settings-section">
      <h3>${n}</h3>
      <p class="settings-hint">Mock add-on pane rendered by the settings widget fixture.</p>
      <div class="settings-addon-grid">
        ${["Credentials","Routes","Runtime options"].filter((c)=>!i||c.toLowerCase().includes(String(i).toLowerCase())).map((c)=>u`
          <div class="settings-addon-card">
            <div class="settings-addon-card-header">
              <div>
                <div class="settings-addon-name">${c}</div>
                <div class="settings-addon-subtitle">${r}</div>
              </div>
              <span class="settings-addon-enabled">fixture</span>
            </div>
            <div class="settings-row settings-row-vertical">
              <label>Mock field</label>
              <input type="text" value=${`${n.toLowerCase().replace(/\s+/g,"-")}:${c.toLowerCase().replace(/\s+/g,"-")}`} readonly />
            </div>
          </div>
        `)}
      </div>
    </div>
  `}function S_(){let n=[{id:"fixture-z-observability",label:"Observability",body:"Latency, traces, and metrics."},{id:"fixture-a-portainer",label:"Portainer",body:"Container endpoint settings."},{id:"fixture-m-proxmox",label:"Proxmox",body:"Cluster profile and token settings."},{id:"fixture-b-cheapskate",label:"Cheapskate",body:"Model cost controls."}];for(let r of n)kn({id:r.id,label:r.label,icon:J_,searchable:!0,searchPlaceholder:`Filter ${r.label} settings…`,order:r.id==="fixture-z-observability"?1:999,component:(i)=>u`<${E_} label=${r.label} body=${r.body} filter=${i?.filter||""} />`})}var ln={userName:"Rui Carmo",assistantName:"Smith",userAvatar:"",assistantAvatar:"",composeUploadLimitMb:32,workspaceUploadLimitMb:256,widgetToken:"piclaw_widget_fixture_token_0123456789abcdef",searchMatchMode:"or",instanceTotp:{configured:!0,issuer:"Piclaw Fixture",label:"Piclaw Fixture:Rui Carmo",secret:"JBSWY3DPEHPK3PXP",otpauth:"otpauth://totp/Piclaw%20Fixture:Rui%20Carmo?secret=JBSWY3DPEHPK3PXP&issuer=Piclaw%20Fixture",qrSvg:'<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><rect width="96" height="96" rx="10" fill="#fff"/><g fill="#111"><rect x="10" y="10" width="22" height="22"/><rect x="64" y="10" width="22" height="22"/><rect x="10" y="64" width="22" height="22"/><rect x="40" y="14" width="8" height="8"/><rect x="52" y="26" width="8" height="8"/><rect x="42" y="42" width="10" height="10"/><rect x="62" y="46" width="8" height="8"/><rect x="76" y="60" width="8" height="8"/><rect x="48" y="72" width="8" height="8"/></g></svg>'},providers:[{id:"openai",label:"OpenAI",authType:"api_key",configured:!0},{id:"anthropic",label:"Anthropic",authType:"api_key",configured:!1},{id:"github-copilot",label:"GitHub Copilot",authType:"oauth",configured:!0}],models:["openai/gpt-5.1","anthropic/claude-sonnet-4-5","github-copilot/gpt-5.4-mini"],model_options:[{label:"openai/gpt-5.1",provider:"openai",name:"GPT-5.1",context_window:200000,reasoning:!0},{label:"anthropic/claude-sonnet-4-5",provider:"anthropic",name:"Claude Sonnet 4.5",context_window:200000,reasoning:!0},{label:"github-copilot/gpt-5.4-mini",provider:"github-copilot",name:"GPT-5.4 mini",context_window:128000,reasoning:!1}],current:"openai/gpt-5.1",thinking_level:"medium",supports_thinking:!0,available_thinking_levels:["off","minimal","low","medium","high"],themes:[{id:"system",label:"System",dark:!1},{id:"ipad-pro",label:"iPad Pro",dark:!0},{id:"terminal",label:"Terminal",dark:!0}],colorKeys:["accent","background","surface","text"],toolsets:[{name:"core",description:"Core shell and file tools",tools:[{name:"read",kind:"read-only"},{name:"bash",kind:"mutating"}]},{name:"ui",description:"Web UI posting tools",tools:[{name:"send_dashboard_widget",kind:"mutating"},{name:"send_adaptive_card",kind:"mutating"}]},{name:"remote",description:"Infrastructure tools",tools:[{name:"ssh",kind:"mixed"},{name:"proxmox",kind:"mixed"},{name:"portainer",kind:"mixed"}]}]},a_={current:ln.current,models:ln.models,model_options:ln.model_options,thinking_level:ln.thinking_level,supports_thinking:ln.supports_thinking,available_thinking_levels:ln.available_thinking_levels},pt={sources:["fixture-catalog"],failed_sources:[],addons:[{slug:"cheapskate",name:"Cheapskate",description:"Model cost controls and routing hints.",installed:!0,enabled:!0,version:"0.1.0",bundled:!1},{slug:"observability",name:"Observability",description:"Local metrics and tracing panels.",installed:!0,enabled:!0,version:"0.2.0",bundled:!1},{slug:"portainer",name:"Portainer",description:"Container management add-on.",installed:!1,enabled:!1,version:"0.3.0",bundled:!1},{slug:"proxmox",name:"Proxmox",description:"Proxmox inventory and workflow add-on.",installed:!0,enabled:!1,version:"0.4.0",bundled:!1}]},$t={entries:[{name:"github/piclaw-bot-pat",type:"token",envVar:"GITHUB_PICLAW_BOT_PAT",updatedAt:new Date().toISOString(),userNote:"Fixture note",agentNote:"Use only through env injection."},{name:"ssh/relay.local",type:"secret",envVar:"SSH_RELAY_LOCAL",updatedAt:new Date().toISOString(),userNote:"",agentNote:""}]},En=new URLSearchParams(window.location.search).get("real")!=="1",ht=window.fetch.bind(window);function _n(n,r=200){return new Response(JSON.stringify(n),{status:r,headers:{"Content-Type":"application/json"}})}function m_(){window.fetch=async(n,r)=>{let i=new URL(typeof n==="string"?n:n.url,window.location.href),c=String(r?.method||"GET").toUpperCase();if(!En)return ht(n,r);if(i.pathname==="/agent/settings-data")return _n(ln);if(i.pathname==="/agent/models")return _n(a_);if(i.pathname==="/agent/addons")return _n(pt);if(i.pathname.startsWith("/agent/addons/"))return _n({ok:!0,message:"Fixture add-on action accepted.",...pt});if(i.pathname==="/agent/keychain"){if(c==="GET")return _n($t);if(c==="POST")return _n({ok:!0,...$t})}if(i.pathname==="/agent/settings/general")return _n({ok:!0,settings:ln});if(i.pathname==="/agent/settings/widget-token/regenerate")return _n({ok:!0,settings:{...ln,widgetToken:`piclaw_widget_fixture_regenerated_${Date.now()}`}});if(i.pathname.startsWith("/agent/default/message"))return _n({command:{status:"success",message:"Fixture command accepted."}});if(i.pathname.startsWith("/agent/settings/"))return _n({ok:!0,settings:ln,items:[],entries:[]});if(i.pathname==="/agent/client-perf")return _n({ok:!0});return ht(n,r)}}function nl(){let n=document.createElement("style");n.textContent=`
    html, body, #settings-widget-fixture-root { margin: 0; width: 100%; height: 100%; overflow: hidden; background: var(--bg-primary, #111827); color: var(--text-primary, #e5e7eb); }
    .settings-fixture-shell { height: 100vh; display: grid; grid-template-rows: auto minmax(0, 1fr); background: var(--bg-primary, #111827); }
    .settings-fixture-toolbar { position: relative; z-index: 2600; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 8px 10px; border-bottom: 1px solid var(--border-color, rgba(148,163,184,.22)); background: var(--bg-secondary, #0f172a); font: 12px var(--font-sans, system-ui, sans-serif); }
    .settings-fixture-toolbar strong { margin-right: 4px; }
    .settings-fixture-toolbar button, .settings-fixture-toolbar select, .settings-fixture-toolbar input { border: 1px solid var(--border-color, rgba(148,163,184,.28)); border-radius: 7px; background: var(--bg-primary, #111827); color: inherit; padding: 5px 8px; font: inherit; }
    .settings-fixture-toolbar input[type="range"] { padding: 0; width: 120px; }
    .settings-fixture-canvas { position: relative; min-height: 0; overflow: hidden; }
    .settings-fixture-canvas .settings-dialog-backdrop { position: absolute; inset: 0; background: color-mix(in srgb, var(--bg-primary, #111827) 82%, transparent); }
    .settings-fixture-canvas .settings-dialog { width: min(var(--fixture-width, 900px), 96vw); height: min(var(--fixture-height, 640px), 94%); max-width: none; max-height: none; }
    .settings-fixture-note { opacity: .72; }
  `,document.head.appendChild(n)}function wt(n){try{window.__piclawSettingsRequestedSection=n}catch(r){}window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:{section:n}}))}function rl(){let n=new URLSearchParams(window.location.search),[r,i]=p(n.get("section")||"general"),[c,o]=p(Number(n.get("width")||900)),[t,s]=p(Number(n.get("height")||640)),[_,l]=p(En),[e,x]=p(0),f=X(()=>["general","sessions","compaction","keyboard","workspace","environment","providers","models","theme","scheduled-tasks","quick-actions","keychain","tools","addons","fixture-b-cheapskate","fixture-z-observability","fixture-a-portainer","fixture-m-proxmox"],[]),y=z((v)=>{i(v),wt(v)},[]),$=z(()=>{En=!En,l(En),x((v)=>v+1)},[]);return u`
    <div class="settings-fixture-shell">
      <div class="settings-fixture-toolbar">
        <strong>Settings fixture</strong>
        <label>Section <select value=${r} onChange=${(v)=>y(v.target.value)}>${f.map((v)=>u`<option value=${v}>${v}</option>`)}</select></label>
        <label>Width <input type="range" min="480" max="1200" value=${c} onInput=${(v)=>o(Number(v.target.value))} /> ${c}px</label>
        <label>Height <input type="range" min="420" max="900" value=${t} onInput=${(v)=>s(Number(v.target.value))} /> ${t}px</label>
        <button type="button" onClick=${$}>${_?"Mock data":"Real endpoints"}</button>
        <button type="button" onClick=${()=>x((v)=>v+1)}>Remount</button>
        <span class="settings-fixture-note">Add-on panes are registered in scrambled order for nav ordering tests.</span>
      </div>
      <div class="settings-fixture-canvas" style=${`--fixture-width:${c}px;--fixture-height:${t}px;`}>
        <${Cr} key=${e} onClose=${()=>{}} />
      </div>
    </div>
  `}function il(){S_(),m_(),nl();let n=new URLSearchParams(window.location.search);wt(n.get("section")||"general");let r=document.getElementById("settings-widget-fixture-root")||document.body.appendChild(document.createElement("div"));r.id="settings-widget-fixture-root",An(u`<${rl} />`,r),window.piclawWidget?.ready?.({title:"Settings fixture",mockMode:En})}il();

//# debugId=3611806E7BE9BA0964756E2164756E21
//# sourceMappingURL=settings-widget-fixture.bundle.js.map
