var xu=Object.defineProperty;var vu=(n)=>n;function bu(n,r){this[n]=vu.bind(null,r)}var cn=(n,r)=>{for(var i in r)xu(n,i,{get:r[i],enumerable:!0,configurable:!0,set:bu.bind(r,i)})};var Z=(n,r)=>()=>(n&&(r=n(n=0)),r);var Pu={};cn(Pu,{useState:()=>$,useRef:()=>D,useReducer:()=>kc,useMemo:()=>I,useLayoutEffect:()=>kr,useImperativeHandle:()=>Ru,useErrorBoundary:()=>Hu,useEffect:()=>M,useDebugValue:()=>Gu,useContext:()=>Uu,useCallback:()=>R,render:()=>qn,html:()=>l,h:()=>ar,createContext:()=>Wu,Component:()=>nr});function xn(n,r){for(var i in r)n[i]=r[i];return n}function mr(n){n&&n.parentNode&&n.parentNode.removeChild(n)}function ar(n,r,i){var c,_,u,f={};for(u in r)u=="key"?c=r[u]:u=="ref"?_=r[u]:f[u]=r[u];if(arguments.length>2&&(f.children=arguments.length>3?Kr.call(arguments,2):i),typeof n=="function"&&n.defaultProps!=null)for(u in n.defaultProps)f[u]===void 0&&(f[u]=n.defaultProps[u]);return pr(n,f,c,_,null)}function pr(n,r,i,c,_){var u={type:n,props:r,key:i,ref:c,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:_==null?++gc:_,__i:-1,__u:0};return _==null&&J.vnode!=null&&J.vnode(u),u}function Fr(n){return n.children}function nr(n,r){this.props=n,this.context=r}function An(n,r){if(r==null)return n.__?An(n.__,n.__i+1):null;for(var i;r<n.__k.length;r++)if((i=n.__k[r])!=null&&i.__e!=null)return i.__e;return typeof n.type=="function"?An(n):null}function Fu(n){if(n.__P&&n.__d){var r=n.__v,i=r.__e,c=[],_=[],u=xn({},r);u.__v=r.__v+1,J.vnode&&J.vnode(u),ni(n.__P,u,r,n.__n,n.__P.namespaceURI,32&r.__u?[i]:null,c,i==null?An(r):i,!!(32&r.__u),_),u.__v=r.__v,u.__.__k[u.__i]=u,bc(c,u,_),r.__e=r.__=null,u.__e!=i&&hc(u)}}function hc(n){if((n=n.__)!=null&&n.__c!=null)return n.__e=n.__c.base=null,n.__k.some(function(r){if(r!=null&&r.__e!=null)return n.__e=n.__c.base=r.__e}),hc(n)}function Jr(n){(!n.__d&&(n.__d=!0)&&Bn.push(n)&&!br.__r++||ai!=J.debounceRendering)&&((ai=J.debounceRendering)||$c)(br)}function br(){try{for(var n,r=1;Bn.length;)Bn.length>r&&Bn.sort(wc),n=Bn.shift(),r=Bn.length,Fu(n)}finally{Bn.length=br.__r=0}}function xc(n,r,i,c,_,u,f,o,s,g,v){var t,b,h,x,F,y,K,T=c&&c.__k||vr,L=r.length;for(s=ku(i,r,T,s,L),t=0;t<L;t++)(h=i.__k[t])!=null&&(b=h.__i!=-1&&T[h.__i]||xr,h.__i=t,y=ni(n,h,b,_,u,f,o,s,g,v),x=h.__e,h.ref&&b.ref!=h.ref&&(b.ref&&ri(b.ref,null,h),v.push(h.ref,h.__c||x,h)),F==null&&x!=null&&(F=x),(K=!!(4&h.__u))||b.__k===h.__k?(s=vc(h,s,n,K),K&&b.__e&&(b.__e=null)):typeof h.type=="function"&&y!==void 0?s=y:x&&(s=x.nextSibling),h.__u&=-7);return i.__e=F,s}function ku(n,r,i,c,_){var u,f,o,s,g,v=i.length,t=v,b=0;for(n.__k=Array(_),u=0;u<_;u++)(f=r[u])!=null&&typeof f!="boolean"&&typeof f!="function"?(typeof f=="string"||typeof f=="number"||typeof f=="bigint"||f.constructor==String?f=n.__k[u]=pr(null,f,null,null,null):zr(f)?f=n.__k[u]=pr(Fr,{children:f},null,null,null):f.constructor===void 0&&f.__b>0?f=n.__k[u]=pr(f.type,f.props,f.key,f.ref?f.ref:null,f.__v):n.__k[u]=f,s=u+b,f.__=n,f.__b=n.__b+1,o=null,(g=f.__i=Bu(f,i,s,t))!=-1&&(t--,(o=i[g])&&(o.__u|=2)),o==null||o.__v==null?(g==-1&&(_>v?b--:_<v&&b++),typeof f.type!="function"&&(f.__u|=4)):g!=s&&(g==s-1?b--:g==s+1?b++:(g>s?b--:b++,f.__u|=4))):n.__k[u]=null;if(t)for(u=0;u<v;u++)(o=i[u])!=null&&(2&o.__u)==0&&(o.__e==c&&(c=An(o)),zc(o,o));return c}function vc(n,r,i,c){var _,u;if(typeof n.type=="function"){for(_=n.__k,u=0;_&&u<_.length;u++)_[u]&&(_[u].__=n,r=vc(_[u],r,i,c));return r}n.__e!=r&&(c&&(r&&n.type&&!r.parentNode&&(r=An(n)),i.insertBefore(n.__e,r||null)),r=n.__e);do r=r&&r.nextSibling;while(r!=null&&r.nodeType==8);return r}function Bu(n,r,i,c){var _,u,f,o=n.key,s=n.type,g=r[i],v=g!=null&&(2&g.__u)==0;if(g===null&&o==null||v&&o==g.key&&s==g.type)return i;if(c>(v?1:0)){for(_=i-1,u=i+1;_>=0||u<r.length;)if((g=r[f=_>=0?_--:u++])!=null&&(2&g.__u)==0&&o==g.key&&s==g.type)return f}return-1}function nc(n,r,i){r[0]=="-"?n.setProperty(r,i==null?"":i):n[r]=i==null?"":typeof i!="number"||zu.test(r)?i:i+"px"}function wr(n,r,i,c,_){var u,f;n:if(r=="style")if(typeof i=="string")n.style.cssText=i;else{if(typeof c=="string"&&(n.style.cssText=c=""),c)for(r in c)i&&r in i||nc(n.style,r,"");if(i)for(r in i)c&&i[r]==c[r]||nc(n.style,r,i[r])}else if(r[0]=="o"&&r[1]=="n")u=r!=(r=r.replace(yc,"$1")),f=r.toLowerCase(),r=f in n||r=="onFocusOut"||r=="onFocusIn"?f.slice(2):r.slice(2),n.l||(n.l={}),n.l[r+u]=i,i?c?i[an]=c[an]:(i[an]=Sr,n.addEventListener(r,u?er:Or,u)):n.removeEventListener(r,u?er:Or,u);else{if(_=="http://www.w3.org/2000/svg")r=r.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(r!="width"&&r!="height"&&r!="href"&&r!="list"&&r!="form"&&r!="tabIndex"&&r!="download"&&r!="rowSpan"&&r!="colSpan"&&r!="role"&&r!="popover"&&r in n)try{n[r]=i==null?"":i;break n}catch(o){}typeof i=="function"||(i==null||i===!1&&r[4]!="-"?n.removeAttribute(r):n.setAttribute(r,r=="popover"&&i==1?"":i))}}function rc(n){return function(r){if(this.l){var i=this.l[r.type+n];if(r[yr]==null)r[yr]=Sr++;else if(r[yr]<i[an])return;return i(J.event?J.event(r):r)}}}function ni(n,r,i,c,_,u,f,o,s,g){var v,t,b,h,x,F,y,K,T,L,k,U,z,j,X,w=r.type;if(r.constructor!==void 0)return null;128&i.__u&&(s=!!(32&i.__u),u=[o=r.__e=i.__e]),(v=J.__b)&&v(r);n:if(typeof w=="function")try{if(K=r.props,T=w.prototype&&w.prototype.render,L=(v=w.contextType)&&c[v.__c],k=v?L?L.props.value:v.__:c,i.__c?y=(t=r.__c=i.__c).__=t.__E:(T?r.__c=t=new w(K,k):(r.__c=t=new nr(K,k),t.constructor=w,t.render=ju),L&&L.sub(t),t.state||(t.state={}),t.__n=c,b=t.__d=!0,t.__h=[],t._sb=[]),T&&t.__s==null&&(t.__s=t.state),T&&w.getDerivedStateFromProps!=null&&(t.__s==t.state&&(t.__s=xn({},t.__s)),xn(t.__s,w.getDerivedStateFromProps(K,t.__s))),h=t.props,x=t.state,t.__v=r,b)T&&w.getDerivedStateFromProps==null&&t.componentWillMount!=null&&t.componentWillMount(),T&&t.componentDidMount!=null&&t.__h.push(t.componentDidMount);else{if(T&&w.getDerivedStateFromProps==null&&K!==h&&t.componentWillReceiveProps!=null&&t.componentWillReceiveProps(K,k),r.__v==i.__v||!t.__e&&t.shouldComponentUpdate!=null&&t.shouldComponentUpdate(K,t.__s,k)===!1){r.__v!=i.__v&&(t.props=K,t.state=t.__s,t.__d=!1),r.__e=i.__e,r.__k=i.__k,r.__k.some(function(G){G&&(G.__=r)}),vr.push.apply(t.__h,t._sb),t._sb=[],t.__h.length&&f.push(t);break n}t.componentWillUpdate!=null&&t.componentWillUpdate(K,t.__s,k),T&&t.componentDidUpdate!=null&&t.__h.push(function(){t.componentDidUpdate(h,x,F)})}if(t.context=k,t.props=K,t.__P=n,t.__e=!1,U=J.__r,z=0,T)t.state=t.__s,t.__d=!1,U&&U(r),v=t.render(t.props,t.state,t.context),vr.push.apply(t.__h,t._sb),t._sb=[];else do t.__d=!1,U&&U(r),v=t.render(t.props,t.state,t.context),t.state=t.__s;while(t.__d&&++z<25);t.state=t.__s,t.getChildContext!=null&&(c=xn(xn({},c),t.getChildContext())),T&&!b&&t.getSnapshotBeforeUpdate!=null&&(F=t.getSnapshotBeforeUpdate(h,x)),j=v!=null&&v.type===Fr&&v.key==null?Kc(v.props.children):v,o=xc(n,zr(j)?j:[j],r,i,c,_,u,f,o,s,g),t.base=r.__e,r.__u&=-161,t.__h.length&&f.push(t),y&&(t.__E=t.__=null)}catch(G){if(r.__v=null,s||u!=null)if(G.then){for(r.__u|=s?160:128;o&&o.nodeType==8&&o.nextSibling;)o=o.nextSibling;u[u.indexOf(o)]=null,r.__e=o}else{for(X=u.length;X--;)mr(u[X]);dr(r)}else r.__e=i.__e,r.__k=i.__k,G.then||dr(r);J.__e(G,r,i)}else u==null&&r.__v==i.__v?(r.__k=i.__k,r.__e=i.__e):o=r.__e=Tu(i.__e,r,i,c,_,u,f,s,g);return(v=J.diffed)&&v(r),128&r.__u?void 0:o}function dr(n){n&&(n.__c&&(n.__c.__e=!0),n.__k&&n.__k.some(dr))}function bc(n,r,i){for(var c=0;c<i.length;c++)ri(i[c],i[++c],i[++c]);J.__c&&J.__c(r,n),n.some(function(_){try{n=_.__h,_.__h=[],n.some(function(u){u.call(_)})}catch(u){J.__e(u,_.__v)}})}function Kc(n){return typeof n!="object"||n==null||n.__b>0?n:zr(n)?n.map(Kc):xn({},n)}function Tu(n,r,i,c,_,u,f,o,s){var g,v,t,b,h,x,F,y=i.props||xr,K=r.props,T=r.type;if(T=="svg"?_="http://www.w3.org/2000/svg":T=="math"?_="http://www.w3.org/1998/Math/MathML":_||(_="http://www.w3.org/1999/xhtml"),u!=null){for(g=0;g<u.length;g++)if((h=u[g])&&"setAttribute"in h==!!T&&(T?h.localName==T:h.nodeType==3)){n=h,u[g]=null;break}}if(n==null){if(T==null)return document.createTextNode(K);n=document.createElementNS(_,T,K.is&&K),o&&(J.__m&&J.__m(r,u),o=!1),u=null}if(T==null)y===K||o&&n.data==K||(n.data=K);else{if(u=u&&Kr.call(n.childNodes),!o&&u!=null)for(y={},g=0;g<n.attributes.length;g++)y[(h=n.attributes[g]).name]=h.value;for(g in y)h=y[g],g=="dangerouslySetInnerHTML"?t=h:g=="children"||(g in K)||g=="value"&&("defaultValue"in K)||g=="checked"&&("defaultChecked"in K)||wr(n,g,null,h,_);for(g in K)h=K[g],g=="children"?b=h:g=="dangerouslySetInnerHTML"?v=h:g=="value"?x=h:g=="checked"?F=h:o&&typeof h!="function"||y[g]===h||wr(n,g,h,y[g],_);if(v)o||t&&(v.__html==t.__html||v.__html==n.innerHTML)||(n.innerHTML=v.__html),r.__k=[];else if(t&&(n.innerHTML=""),xc(r.type=="template"?n.content:n,zr(b)?b:[b],r,i,c,T=="foreignObject"?"http://www.w3.org/1999/xhtml":_,u,f,u?u[0]:i.__k&&An(i,0),o,s),u!=null)for(g=u.length;g--;)mr(u[g]);o||(g="value",T=="progress"&&x==null?n.removeAttribute("value"):x!=null&&(x!==n[g]||T=="progress"&&!x||T=="option"&&x!=y[g])&&wr(n,g,x,y[g],_),g="checked",F!=null&&F!=n[g]&&wr(n,g,F,y[g],_))}return n}function ri(n,r,i){try{if(typeof n=="function"){var c=typeof n.__u=="function";c&&n.__u(),c&&r==null||(n.__u=n(r))}else n.current=r}catch(_){J.__e(_,i)}}function zc(n,r,i){var c,_;if(J.unmount&&J.unmount(n),(c=n.ref)&&(c.current&&c.current!=n.__e||ri(c,null,r)),(c=n.__c)!=null){if(c.componentWillUnmount)try{c.componentWillUnmount()}catch(u){J.__e(u,r)}c.base=c.__P=null}if(c=n.__k)for(_=0;_<c.length;_++)c[_]&&zc(c[_],r,i||typeof n.type!="function");i||mr(n.__e),n.__c=n.__=n.__e=void 0}function ju(n,r,i){return this.constructor(n,i)}function qn(n,r,i){var c,_,u,f;r==document&&(r=document.documentElement),J.__&&J.__(n,r),_=(c=typeof i=="function")?null:i&&i.__k||r.__k,u=[],f=[],ni(r,n=(!c&&i||r).__k=ar(Fr,null,[n]),_||xr,xr,r.namespaceURI,!c&&i?[i]:_?null:r.firstChild?Kr.call(r.childNodes):null,u,!c&&i?i:_?_.__e:r.firstChild,c,f),bc(u,n,f)}function Wu(n){function r(i){var c,_;return this.getChildContext||(c=new Set,(_={})[r.__c]=this,this.getChildContext=function(){return _},this.componentWillUnmount=function(){c=null},this.shouldComponentUpdate=function(u){this.props.value!=u.value&&c.forEach(function(f){f.__e=!0,Jr(f)})},this.sub=function(u){c.add(u);var f=u.componentWillUnmount;u.componentWillUnmount=function(){c&&c.delete(u),f&&f.call(u)}}),i.children}return r.__c="__cC"+pc++,r.__=n,r.Provider=r.__l=(r.Consumer=function(i,c){return i.children(c)}).contextType=r,r}function In(n,r){S.__h&&S.__h(e,n,Qn||r),Qn=0;var i=e.__H||(e.__H={__:[],__h:[]});return n>=i.__.length&&i.__.push({}),i.__[n]}function $(n){return Qn=1,kc(Bc,n)}function kc(n,r,i){var c=In(Tn++,2);if(c.t=n,!c.__c&&(c.__=[i?i(r):Bc(void 0,r),function(o){var s=c.__N?c.__N[0]:c.__[0],g=c.t(s,o);s!==g&&(c.__N=[g,c.__[1]],c.__c.setState({}))}],c.__c=e,!e.__f)){var _=function(o,s,g){if(!c.__c.__H)return!0;var v=c.__c.__H.__.filter(function(b){return b.__c});if(v.every(function(b){return!b.__N}))return!u||u.call(this,o,s,g);var t=c.__c.props!==o;return v.some(function(b){if(b.__N){var h=b.__[0];b.__=b.__N,b.__N=void 0,h!==b.__[0]&&(t=!0)}}),u&&u.call(this,o,s,g)||t};e.__f=!0;var{shouldComponentUpdate:u,componentWillUpdate:f}=e;e.componentWillUpdate=function(o,s,g){if(this.__e){var v=u;u=void 0,_(o,s,g),u=v}f&&f.call(this,o,s,g)},e.shouldComponentUpdate=_}return c.__N||c.__}function M(n,r){var i=In(Tn++,3);!S.__s&&ii(i.__H,r)&&(i.__=n,i.u=r,e.__H.__h.push(i))}function kr(n,r){var i=In(Tn++,4);!S.__s&&ii(i.__H,r)&&(i.__=n,i.u=r,e.__h.push(i))}function D(n){return Qn=5,I(function(){return{current:n}},[])}function Ru(n,r,i){Qn=6,kr(function(){if(typeof n=="function"){var c=n(r());return function(){n(null),c&&typeof c=="function"&&c()}}if(n)return n.current=r(),function(){return n.current=null}},i==null?i:i.concat(n))}function I(n,r){var i=In(Tn++,7);return ii(i.__H,r)&&(i.__=n(),i.__H=r,i.__h=n),i.__}function R(n,r){return Qn=8,I(function(){return n},r)}function Uu(n){var r=e.context[n.__c],i=In(Tn++,9);return i.c=n,r?(i.__==null&&(i.__=!0,r.sub(e)),r.props.value):n.__}function Gu(n,r){S.useDebugValue&&S.useDebugValue(r?r(n):n)}function Hu(n){var r=In(Tn++,10),i=$();return r.__=n,e.componentDidCatch||(e.componentDidCatch=function(c,_){r.__&&r.__(c,_),i[1](c)}),[i[0],function(){i[1](void 0)}]}function Lu(){for(var n;n=Fc.shift();){var r=n.__H;if(n.__P&&r)try{r.__h.some(hr),r.__h.some(Er),r.__h=[]}catch(i){r.__h=[],S.__e(i,n.__v)}}}function Nu(n){var r,i=function(){clearTimeout(c),sc&&cancelAnimationFrame(r),setTimeout(n)},c=setTimeout(i,35);sc&&(r=requestAnimationFrame(i))}function hr(n){var r=e,i=n.__c;typeof i=="function"&&(n.__c=void 0,i()),e=r}function Er(n){var r=e;n.__c=n.__(),e=r}function ii(n,r){return!n||n.length!==r.length||r.some(function(i,c){return i!==n[c]})}function Bc(n,r){return typeof r=="function"?r(n):r}function Vu(n){var r=tc.get(this);return r||(r=new Map,tc.set(this,r)),(r=Tc(this,r.get(n)||(r.set(n,r=function(i){for(var c,_,u=1,f="",o="",s=[0],g=function(b){u===1&&(b||(f=f.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?s.push(0,b,f):u===3&&(b||f)?(s.push(3,b,f),u=2):u===2&&f==="..."&&b?s.push(4,b,0):u===2&&f&&!b?s.push(5,0,!0,f):u>=5&&((f||!b&&u===5)&&(s.push(u,0,f,_),u=6),b&&(s.push(u,b,0,_),u=6)),f=""},v=0;v<i.length;v++){v&&(u===1&&g(),g(v));for(var t=0;t<i[v].length;t++)c=i[v][t],u===1?c==="<"?(g(),s=[s],u=3):f+=c:u===4?f==="--"&&c===">"?(u=1,f=""):f=c+f[0]:o?c===o?o="":f+=c:c==='"'||c==="'"?o=c:c===">"?(g(),u=1):u&&(c==="="?(u=5,_=f,f=""):c==="/"&&(u<5||i[v][t+1]===">")?(g(),u===3&&(s=s[0]),u=s,(s=s[0]).push(2,0,u),u=0):c===" "||c==="\t"||c===`
`||c==="\r"?(g(),u=2):f+=c),u===3&&f==="!--"&&(u=4,s=s[0])}return g(),s}(n)),r),arguments,[])).length>1?r:r[0]}var Kr,J,gc,Ku,Bn,ai,$c,wc,Yr,yr,an,yc,Sr,Or,er,pc,xr,vr,zu,zr,Tn,e,Cr,ic,Qn=0,Fc,S,cc,_c,uc,fc,lc,oc,sc,Tc=function(n,r,i,c){var _;r[0]=0;for(var u=1;u<r.length;u++){var f=r[u++],o=r[u]?(r[0]|=f?1:2,i[r[u++]]):r[++u];f===3?c[0]=o:f===4?c[1]=Object.assign(c[1]||{},o):f===5?(c[1]=c[1]||{})[r[++u]]=o:f===6?c[1][r[++u]]+=o+"":f?(_=n.apply(o,Tc(n,o,i,["",null])),c.push(_),o[0]?r[0]|=2:(r[u-2]=0,r[u]=_)):c.push(o)}return c},tc,l;var m=Z(()=>{xr={},vr=[],zu=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,zr=Array.isArray;Kr=vr.slice,J={__e:function(n,r,i,c){for(var _,u,f;r=r.__;)if((_=r.__c)&&!_.__)try{if((u=_.constructor)&&u.getDerivedStateFromError!=null&&(_.setState(u.getDerivedStateFromError(n)),f=_.__d),_.componentDidCatch!=null&&(_.componentDidCatch(n,c||{}),f=_.__d),f)return _.__E=_}catch(o){n=o}throw n}},gc=0,Ku=function(n){return n!=null&&n.constructor===void 0},nr.prototype.setState=function(n,r){var i;i=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=xn({},this.state),typeof n=="function"&&(n=n(xn({},i),this.props)),n&&xn(i,n),n!=null&&this.__v&&(r&&this._sb.push(r),Jr(this))},nr.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),Jr(this))},nr.prototype.render=Fr,Bn=[],$c=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,wc=function(n,r){return n.__v.__b-r.__v.__b},br.__r=0,Yr=Math.random().toString(8),yr="__d"+Yr,an="__a"+Yr,yc=/(PointerCapture)$|Capture$/i,Sr=0,Or=rc(!1),er=rc(!0),pc=0;Fc=[],S=J,cc=S.__b,_c=S.__r,uc=S.diffed,fc=S.__c,lc=S.unmount,oc=S.__;S.__b=function(n){e=null,cc&&cc(n)},S.__=function(n,r){n&&r.__k&&r.__k.__m&&(n.__m=r.__k.__m),oc&&oc(n,r)},S.__r=function(n){_c&&_c(n),Tn=0;var r=(e=n.__c).__H;r&&(Cr===e?(r.__h=[],e.__h=[],r.__.some(function(i){i.__N&&(i.__=i.__N),i.u=i.__N=void 0})):(r.__h.some(hr),r.__h.some(Er),r.__h=[],Tn=0)),Cr=e},S.diffed=function(n){uc&&uc(n);var r=n.__c;r&&r.__H&&(r.__H.__h.length&&(Fc.push(r)!==1&&ic===S.requestAnimationFrame||((ic=S.requestAnimationFrame)||Nu)(Lu)),r.__H.__.some(function(i){i.u&&(i.__H=i.u),i.u=void 0})),Cr=e=null},S.__c=function(n,r){r.some(function(i){try{i.__h.some(hr),i.__h=i.__h.filter(function(c){return!c.__||Er(c)})}catch(c){r.some(function(_){_.__h&&(_.__h=[])}),r=[],S.__e(c,i.__v)}}),fc&&fc(n,r)},S.unmount=function(n){lc&&lc(n);var r,i=n.__c;i&&i.__H&&(i.__H.__.some(function(c){try{hr(c)}catch(_){r=_}}),i.__H=void 0,r&&S.__e(r,i.__v))};sc=typeof requestAnimationFrame=="function";tc=new Map;l=Vu.bind(ar)});function jc({children:n,className:r=""}){let[i,c]=$(null);return M(()=>{if(typeof document>"u")return;let _=document.createElement("div");return _.className=r||"",document.body.appendChild(_),c(_),()=>{try{qn(null,_)}finally{_.remove()}}},[]),M(()=>{if(!i)return;i.className=r||"";return},[r,i]),kr(()=>{if(!i)return;qn(n,i);return},[n,i]),null}var Wc=Z(()=>{m()});function ci(n,r){let i=String(n.label||"").localeCompare(String(r.label||""),void 0,{sensitivity:"base"});if(i!==0)return i;return String(n.id||"").localeCompare(String(r.id||""),void 0,{sensitivity:"base"})}function jn(n){let r=Un.findIndex((i)=>i.id===n.id);if(r>=0)Un[r]=n;else Un.push(n);Un.sort(ci)}function o0(n){let r=Un.findIndex((i)=>i.id===n);if(r>=0)Un.splice(r,1)}function Rc(){return[...Un]}function s0(){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent("piclaw:settings-panes-changed"))}var Un;var Dn=Z(()=>{Un=[]});function Br(n){let r=typeof n==="string"?n.trim():"";return r?r:null}function Uc(n={}){if(typeof window>"u")return;let r=Br(n.section);try{if(window.__piclawSettingsOpenRequested=!0,r)window.__piclawSettingsRequestedSection=r;else delete window.__piclawSettingsRequestedSection}catch(i){console.debug("[settings-dialog-events] failed to record open request flags",i)}window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:r?{section:r}:void 0}))}function _i(){if(typeof window>"u")return null;return Br(window.__piclawSettingsRequestedSection)}function Gc(){if(typeof window>"u")return{open:!1,section:null};let n=Boolean(window.__piclawSettingsOpenRequested),r=_i();try{window.__piclawSettingsOpenRequested=!1,delete window.__piclawSettingsRequestedSection}catch(i){console.debug("[settings-dialog-events] failed to clear open request flags",i)}return{open:n,section:r}}function Lc(n=typeof window<"u"?window:null){return n||null}function Tr(){if(typeof performance<"u"&&typeof performance.now==="function")return performance.now();return Date.now()}function _r(n,r){return`${n}:${r}`}function Nc(n){return`${n}-${Math.random().toString(36).slice(2,10)}-${Date.now().toString(36)}`}function Vc(n,r){if(n.length<=r)return;n.splice(0,n.length-r)}function Gn(n){if(!n||typeof n!=="object")return null;return{...n}}function Nn(n){if(!n)return null;return Hn.find((r)=>r.id===n)||null}function ui(n,r){if(typeof performance>"u"||typeof performance.mark!=="function")return;try{performance.mark(`piclaw:${n}:${r}`)}catch(i){console.debug("[app-perf] Ignoring performance.mark failure.",i,{traceId:n,phase:r})}}function Pc(n){if(typeof performance>"u"||typeof performance.clearMarks!=="function")return;try{performance.clearMarks(`piclaw:${n}:start`);let r=Nn(n);if(!r)return;for(let i of r.phases)performance.clearMarks(`piclaw:${n}:${i.phase}`)}catch(r){console.debug("[app-perf] Ignoring performance.clearMarks failure.",r,{traceId:n})}}function Hc(n,r,i){let c=Ln.get(_r(n,r));if(c&&Nn(c)?.status==="active")cr(c,"cancelled","superseded",{replacementType:n,replacementChatJid:r});let _=Nc(n),u={id:_,type:n,chatJid:r,startedAt:Tr(),detail:Gn(i),phases:[],status:"active"};return Hn.push(u),Vc(Hn,100),Ln.set(_r(n,r),_),ui(_,"start"),_}function cr(n,r,i,c,_){let u=Nn(n);if(!u||u.status!=="active")return;if(i)u.phases.push({phase:i,at:Tr(),detail:Gn(c)}),ui(u.id,i);if(u.status=r,u.completedAt=Tr(),u.durationMs=u.completedAt-u.startedAt,_!==void 0)u.error=_ instanceof Error?_.message:String(_);let f=_r(u.type,u.chatJid);if(Ln.get(f)===u.id)Ln.delete(f);Pc(u.id)}function Mu(n=Lc()){let r=n?.__PICLAW_PERF__;if(r)return r;if(n)n.__PICLAW_PERF__=jr;return jr}function Zn(n=Lc()){return Mu(n)}function $0(n,r,i){return Zn().ensureTrace(n,r,i)}function w0(n,r){return Zn().getActiveTraceId(n,r)}function y0(n,r,i){Zn().markTrace(n,r,i)}function p0(n,r,i="settled",c){let _=Nn(n);if(!_||_.status!=="active")return!1;let u=new Set(_.phases.map((f)=>f.phase));if(!r.every((f)=>u.has(f)))return!1;return cr(n,"completed",i,c),!0}function h0(n,r,i="failed",c){Zn().failTrace(n,r,i,c)}function x0(n,r="cancelled",i){Zn().cancelTrace(n,r,i)}function fi(n){return Zn().recordRequest(n)}var Hn,ir,Ln,jr;var Mc=Z(()=>{Hn=[],ir=[],Ln=new Map;jr={startTrace(n,r,i){return Hc(n,r,i)},ensureTrace(n,r,i){let c=Ln.get(_r(n,r));if(c&&Nn(c)?.status==="active")return c;return Hc(n,r,i)},getActiveTraceId(n,r){let i=Ln.get(_r(n,r));return i&&Nn(i)?.status==="active"?i:null},markTrace(n,r,i){let c=Nn(n);if(!c||c.status!=="active")return;c.phases.push({phase:r,at:Tr(),detail:Gn(i)}),ui(c.id,r)},completeTrace(n,r="settled",i){cr(n,"completed",r,i)},failTrace(n,r,i="failed",c){cr(n,"failed",i,c,r)},cancelTrace(n,r="cancelled",i){cr(n,"cancelled",r,i)},recordRequest(n){let r=Nc("req");return ir.push({...n,id:r,detail:Gn(n.detail)}),Vc(ir,300),r},getTraces(){return Hn.map((n)=>({...n,detail:Gn(n.detail),phases:n.phases.map((r)=>({...r,detail:Gn(r.detail)}))}))},getRequests(){return ir.map((n)=>({...n,detail:Gn(n.detail)}))},clear(){Hn.forEach((n)=>Pc(n.id)),Hn.splice(0,Hn.length),ir.splice(0,ir.length),Ln.clear()},printSummary(){let n={traces:jr.getTraces(),requests:jr.getRequests()};return console.table(n.traces.map((r)=>({id:r.id,type:r.type,chatJid:r.chatJid,status:r.status,durationMs:Number(r.durationMs||0).toFixed(1),lastPhase:r.phases[r.phases.length-1]?.phase||"start"}))),n}}});function Yn(n){let r=Number(n||0);return Number.isFinite(r)&&r>0?r:null}function Xu(n){try{return Boolean(n?.matchMedia?.("(pointer: coarse)")?.matches)}catch{return!1}}function Au(n){let r=String(n?.navigator?.userAgent||"");return/Android|webOS|iPhone|iPod|Mobile|Windows Phone/i.test(r)}function Xc(n){let r=String(n?.navigator?.userAgent||"");return/iPad|Tablet|PlayBook|Silk/i.test(r)}function Ac(n=typeof window<"u"?window:null){let r=Yn(n?.innerWidth)??Yn(n?.screen?.availWidth)??Yn(n?.screen?.width)??0,i=Yn(n?.innerHeight)??Yn(n?.screen?.availHeight)??Yn(n?.screen?.height)??0,c=r&&i?Math.min(r,i):r||i,_=r&&i?Math.max(r,i):r||i,u=Xu(n),f=Number(n?.navigator?.maxTouchPoints||0),o=u||f>1;if(c>0&&c<=640)return"mobile";if(Au(n)&&!Xc(n))return"mobile";if(Xc(n))return"tablet";if(o&&c>0&&c<=1100)return"tablet";if(_>0&&_<=1180&&c>0&&c<=900)return"tablet";return"desktop"}var nl={};cn(nl,{uploadWorkspaceFile:()=>Cf,uploadMedia:()=>Kf,updateWorkspaceFile:()=>Af,updateScheduledTask:()=>si,submitAdaptiveCardAction:()=>Ff,streamSidePrompt:()=>kf,stopSessionRecording:()=>$i,stopAutoresearch:()=>wf,steerAgentQueueItem:()=>xf,startSessionRecording:()=>gi,setWorkspaceVisibility:()=>Ef,setAgentThoughtVisibility:()=>jf,sessionRecordingPlaybackUrl:()=>yi,sessionRecordingExportUrl:()=>ur,sendPeerAgentMessage:()=>uf,sendAgentMessage:()=>vn,searchPosts:()=>Du,saveWorkspaceSettings:()=>Ki,saveWebPushSubscription:()=>lf,saveUiState:()=>hi,saveQuickActionsSettings:()=>bi,savePostAnnotations:()=>af,saveEnvironmentOverride:()=>Rr,restoreChatBranch:()=>_f,respondToAgentRequest:()=>zf,reorderAgentQueueItem:()=>vf,renameWorkspaceFile:()=>ef,renameChatJid:()=>cf,renameChatBranch:()=>mu,removeAgentQueueItem:()=>hf,reindexWorkspace:()=>Pf,purgeChatBranch:()=>rf,pruneChatBranch:()=>nf,previewSessionRecordingRedaction:()=>pi,moveWorkspaceEntry:()=>Jf,mergeChatBranchIntoParent:()=>au,getWorkspaceTree:()=>Lf,getWorkspaceRawUrl:()=>qc,getWorkspaceIndexStatus:()=>Vf,getWorkspaceFileStat:()=>Xf,getWorkspaceFileDownloadUrl:()=>Sf,getWorkspaceFile:()=>Mf,getWorkspaceDownloadUrl:()=>mf,getWorkspaceBranch:()=>Nf,getWebPushPublicKey:()=>ff,getTimeline:()=>qu,getThumbnailUrl:()=>Rf,getThread:()=>Zu,getSystemMetrics:()=>Yu,getSessionRecordings:()=>ti,getSessionRecording:()=>Wr,getScheduledTasks:()=>oi,getQuickActionsSettings:()=>vi,getPostsByHashtag:()=>Iu,getMediaUrl:()=>Wf,getMediaText:()=>Gf,getMediaInfo:()=>Uf,getMediaBlob:()=>Hf,getEnvironmentSettings:()=>zi,getChatBranches:()=>du,getAutoresearchStatus:()=>$f,getAgents:()=>sf,getAgentThought:()=>Tf,getAgentStatus:()=>tf,getAgentQueueState:()=>pf,getAgentModels:()=>Fi,getAgentContext:()=>gf,getAgentCommands:()=>xi,getActiveChatAgents:()=>Ju,forkChatBranch:()=>Eu,dismissAutoresearch:()=>yf,deleteWorkspaceFile:()=>df,deleteWebPushSubscription:()=>of,deleteSessionRecording:()=>wi,deletePost:()=>eu,createWorkspaceFile:()=>Of,createRootChatSession:()=>Su,createReply:()=>Ou,createPost:()=>Cu,completeInstanceOobe:()=>bf,attachWorkspaceFile:()=>Qf,addToWhitelist:()=>Bf,SSEClient:()=>Ic});async function V(n,r={}){let i=typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now(),c;try{c=await fetch(a+n,{...r,headers:{"Content-Type":"application/json",...r.headers}})}catch(u){throw fi({method:String(r.method||"GET").toUpperCase(),url:n,startedAt:i,durationMs:(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-i,ok:!1,detail:{failedBeforeResponse:!0}}),u}let _=(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-i;if(fi({method:String(r.method||"GET").toUpperCase(),url:n,startedAt:i,durationMs:_,status:c.status,ok:c.ok,requestId:c.headers?.get?.("x-request-id")||null,serverTiming:c.headers?.get?.("Server-Timing")||null}),!c.ok){let u=await c.json().catch(()=>({error:"Unknown error"}));throw Error(u.error||`HTTP ${c.status}`)}return c.json()}function Qc(n){let r=String(n||"").split(`
`),i="message",c=[];for(let u of r)if(u.startsWith("event:"))i=u.slice(6).trim()||"message";else if(u.startsWith("data:"))c.push(u.slice(5).trim());let _=c.join(`
`);if(!_)return null;try{return{event:i,data:JSON.parse(_)}}catch{return{event:i,data:_}}}async function Qu(n,r){if(!n.body)throw Error("Missing event stream body");let i=n.body.getReader(),c=new TextDecoder,_="";while(!0){let{value:f,done:o}=await i.read();if(o)break;_+=c.decode(f,{stream:!0});let s=_.split(`

`);_=s.pop()||"";for(let g of s){let v=Qc(g);if(v)r(v.event,v.data)}}_+=c.decode();let u=Qc(_);if(u)r(u.event,u.data)}async function qu(n=10,r=null,i=null){let c=`/timeline?limit=${n}`;if(r)c+=`&before=${r}`;if(i)c+=`&chat_jid=${encodeURIComponent(i)}`;return V(c)}async function Iu(n,r=50,i=0,c=null){let _=c?`&chat_jid=${encodeURIComponent(c)}`:"";return V(`/hashtag/${encodeURIComponent(n)}?limit=${r}&offset=${i}${_}`)}async function Du(n,r=50,i=0,c=null,_="current",u=null,f=null){let o=c?`&chat_jid=${encodeURIComponent(c)}`:"",s=_?`&scope=${encodeURIComponent(_)}`:"",g=u?`&root_chat_jid=${encodeURIComponent(u)}`:"",v=f?.images?"&images=1":"",t=f?.attachments?"&attachments=1":"";return V(`/search?q=${encodeURIComponent(n)}&limit=${r}&offset=${i}${o}${s}${g}${v}${t}`)}async function Zu(n,r=null){let i=r?`?chat_jid=${encodeURIComponent(r)}`:"";return V(`/thread/${n}${i}`)}async function Yu(){return V("/agent/system-metrics")}async function oi(n={}){let r=new URLSearchParams;if(n?.id)r.set("id",String(n.id));if(n?.chatJid)r.set("chat_jid",String(n.chatJid));if(n?.status&&n.status!=="all")r.set("status",String(n.status));if(n?.limit)r.set("limit",String(n.limit));if(n?.includeRunLogs)r.set("include_run_logs","1");if(n?.runLogLimit)r.set("run_log_limit",String(n.runLogLimit));let i=r.toString()?`?${r.toString()}`:"";return V(`/agent/scheduled-tasks${i}`)}async function si(n,r,i={}){return V("/agent/scheduled-tasks/action",{method:"POST",body:JSON.stringify({action:n,id:r,allow_internal:i?.allowInternal===!0})})}async function ti(){return V("/agent/recordings")}async function Wr(n){return V(`/agent/recordings/${encodeURIComponent(n)}`)}async function gi(n={}){return V("/agent/recordings/start",{method:"POST",body:JSON.stringify(n||{})})}async function $i(n={}){return V("/agent/recordings/stop",{method:"POST",body:JSON.stringify(n||{})})}async function wi(n){return V(`/agent/recordings/${encodeURIComponent(n)}`,{method:"DELETE"})}function ur(n,r="json"){return`/agent/recordings/${encodeURIComponent(n)}/export?format=${encodeURIComponent(r)}`}function yi(n){return`/recordings/playback?id=${encodeURIComponent(n)}`}async function pi(n,r={}){return V("/agent/recordings/redact-preview",{method:"POST",body:JSON.stringify({payload:n,...r})})}async function hi(n){return V("/agent/ui-state",{method:"POST",body:JSON.stringify(n||{})})}async function Cu(n,r=[],i=null){let c=i?`?chat_jid=${encodeURIComponent(i)}`:"";return V(`/post${c}`,{method:"POST",body:JSON.stringify({content:n,media_ids:r})})}async function Ou(n,r,i=[],c=null){let _=c?`?chat_jid=${encodeURIComponent(c)}`:"";return V(`/post/reply${_}`,{method:"POST",body:JSON.stringify({thread_id:n,content:r,media_ids:i})})}async function eu(n,r=!1,i=null){let c=i?`&chat_jid=${encodeURIComponent(i)}`:"",_=`/post/${n}?cascade=${r?"true":"false"}${c}`;return V(_,{method:"DELETE"})}async function vn(n,r,i=null,c=[],_=null,u=null){let f=u?`?chat_jid=${encodeURIComponent(u)}`:"",o={content:r,thread_id:i,media_ids:c,client_context:{screen_hint:Ac()}};if(_==="auto"||_==="queue"||_==="steer")o.mode=_;return V(`/agent/${n}/message${f}`,{method:"POST",body:JSON.stringify(o)})}async function xi(n="web:default"){let r=typeof n==="string"&&n.trim()?n.trim():"web:default";return V(`/agent/commands?chat_jid=${encodeURIComponent(r)}`)}async function vi(){return V("/agent/settings/quick-actions")}async function bi(n){return V("/agent/settings/quick-actions",{method:"POST",body:JSON.stringify(n||{})})}async function Ki(n){return V("/agent/settings/workspace",{method:"POST",body:JSON.stringify(n||{})})}async function zi(){return V("/agent/settings/environment")}async function Rr(n){return V("/agent/settings/environment",{method:"POST",body:JSON.stringify(n||{})})}async function Ju(){return V("/agent/active-chats")}async function du(n=null,r={}){let i=new URLSearchParams;if(n)i.set("root_chat_jid",String(n));if(r?.includeArchived)i.set("include_archived","1");let c=i.toString()?`?${i.toString()}`:"";return V(`/agent/branches${c}`)}async function Eu(n,r={}){return V("/agent/branch-fork",{method:"POST",body:JSON.stringify({source_chat_jid:n,...r?.agentName?{agent_name:r.agentName}:{}})})}async function Su(n){return V("/agent/root-session",{method:"POST",body:JSON.stringify({agent_name:n})})}async function mu(n,r={}){return V("/agent/branch-rename",{method:"POST",body:JSON.stringify({chat_jid:n,...r&&Object.prototype.hasOwnProperty.call(r,"agentName")?{agent_name:r.agentName}:{}})})}async function au(n){return V("/agent/branch-merge-parent",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function nf(n){return V("/agent/branch-prune",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function rf(n){return V("/agent/branch-purge",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function cf(n,r){return V("/agent/rename-jid",{method:"POST",body:JSON.stringify({old_jid:n,new_jid:r})})}async function _f(n,r={}){return V("/agent/branch-restore",{method:"POST",body:JSON.stringify({chat_jid:n,...r&&Object.prototype.hasOwnProperty.call(r,"agentName")?{agent_name:r.agentName}:{}})})}async function uf(n,r,i,c="auto",_={}){let u={source_chat_jid:n,content:i,mode:c,..._?.sourceAgentName?{source_agent_name:_.sourceAgentName}:{},..._?.targetBy==="agent_name"?{target_agent_name:r}:{target_chat_jid:r}};return V("/agent/peer-message",{method:"POST",body:JSON.stringify(u)})}async function ff(){return V("/agent/push/vapid-public-key")}async function lf(n,r={}){let i={subscription:n,...r?.deviceId?{device_id:r.deviceId}:{}};return V("/agent/push/subscription",{method:"POST",body:JSON.stringify(i)})}async function of(n,r={}){let i={subscription:n,...r?.deviceId?{device_id:r.deviceId}:{}};return V("/agent/push/subscription",{method:"DELETE",body:JSON.stringify(i)})}async function sf(){return V("/agent/roster")}async function tf(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return V(`/agent/status${r}`)}async function gf(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return V(`/agent/context${r}`)}async function $f(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return V(`/agent/autoresearch/status${r}`)}async function wf(n=null,r={}){return V("/agent/autoresearch/stop",{method:"POST",body:JSON.stringify({chat_jid:n||void 0,generate_report:r?.generateReport!==!1})})}async function yf(n=null){return V("/agent/autoresearch/dismiss",{method:"POST",body:JSON.stringify({chat_jid:n||void 0})})}async function pf(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return V(`/agent/queue-state${r}`)}async function hf(n,r=null){let i=await fetch(a+"/agent/queue-remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:n,chat_jid:r||void 0})});if(!i.ok){let c=await i.json().catch(()=>({error:"Failed to remove queued item"}));throw Error(c.error||`HTTP ${i.status}`)}return i.json()}async function xf(n,r=null){let i=await fetch(a+"/agent/queue-steer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:n,chat_jid:r||void 0})});if(!i.ok){let c=await i.json().catch(()=>({error:"Failed to steer queued item"}));throw Error(c.error||`HTTP ${i.status}`)}return i.json()}async function vf(n,r,i=null){let c=await fetch(a+"/agent/queue-reorder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from_index:n,to_index:r,chat_jid:i||void 0})});if(!c.ok){let _=await c.json().catch(()=>({error:"Failed to reorder queued item"}));throw Error(_.error||`HTTP ${c.status}`)}return c.json()}async function Fi(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return V(`/agent/models${r}`)}async function bf(n="provider-ready"){return V("/agent/oobe/complete",{method:"POST",body:JSON.stringify({kind:n})})}async function Kf(n){let r=new FormData;r.append("file",n);let i=await fetch(a+"/media/upload",{method:"POST",body:r});if(!i.ok){let c=await i.json().catch(()=>({error:"Upload failed"}));throw Error(c.error||`HTTP ${i.status}`)}return i.json()}async function zf(n,r,i=null){let c=await fetch(a+"/agent/respond",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id:n,outcome:r,chat_jid:i||void 0})});if(!c.ok){let _=await c.json().catch(()=>({error:"Failed to respond"}));throw Error(_.error||`HTTP ${c.status}`)}return c.json()}async function Ff(n){let r=await fetch(a+"/agent/card-action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!r.ok){let i=await r.json().catch(()=>({error:"Adaptive Card action failed"}));throw Error(i.error||`HTTP ${r.status}`)}return r.json()}async function kf(n,r={}){let i=await fetch(a+"/agent/side-prompt/stream",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:n,system_prompt:r.systemPrompt||void 0,chat_jid:r.chatJid||void 0}),signal:r.signal});if(!i.ok){let u=await i.json().catch(()=>({error:"Side prompt failed"}));throw Error(u.error||`HTTP ${i.status}`)}let c=null,_=null;if(await Qu(i,(u,f)=>{if(r.onEvent?.(u,f),u==="side_prompt_thinking_delta")r.onThinkingDelta?.(f?.delta||"");else if(u==="side_prompt_text_delta")r.onTextDelta?.(f?.delta||"");else if(u==="side_prompt_done")c=f;else if(u==="side_prompt_error")_=f}),_){let u=Error(_?.error||"Side prompt failed");throw u.payload=_,u}return c}async function Bf(n,r){let i=await fetch(a+"/agent/whitelist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pattern:n,description:r})});if(!i.ok){let c=await i.json().catch(()=>({error:"Failed to add to whitelist"}));throw Error(c.error||`HTTP ${i.status}`)}return i.json()}async function Tf(n,r="thought"){let i=`/agent/thought?turn_id=${encodeURIComponent(n)}&panel=${encodeURIComponent(r)}`;return V(i)}async function jf(n,r,i){return V("/agent/thought/visibility",{method:"POST",body:JSON.stringify({turn_id:n,panel:r,expanded:Boolean(i)})})}function Wf(n){return`${a}/media/${n}`}function Rf(n){return`${a}/media/${n}/thumbnail`}async function Uf(n){let r=await fetch(`${a}/media/${n}/info`);if(!r.ok)throw Error("Failed to get media info");return r.json()}async function Gf(n){let r=await fetch(`${a}/media/${n}`);if(!r.ok)throw Error("Failed to load media text");return r.text()}async function Hf(n){let r=await fetch(`${a}/media/${n}`);if(!r.ok)throw Error("Failed to load media blob");return r.blob()}async function Lf(n="",r=2,i=!1){let c=`/workspace/tree?path=${encodeURIComponent(n)}&depth=${r}&show_hidden=${i?"1":"0"}`;return V(c)}async function Nf(n=""){let r=`/workspace/branch?path=${encodeURIComponent(n||"")}`;return V(r)}async function Vf(n="all"){let r=`/workspace/index-status?scope=${encodeURIComponent(n||"all")}`;return V(r)}async function Pf(n="all"){return V("/workspace/reindex",{method:"POST",body:JSON.stringify({scope:n})})}async function Mf(n,r=20000,i=null){let c=i?`&mode=${encodeURIComponent(i)}`:"",_=`/workspace/file?path=${encodeURIComponent(n)}&max=${r}${c}`;return V(_)}async function Xf(n){return V(`/workspace/stat?path=${encodeURIComponent(n)}`)}async function Af(n,r){return V("/workspace/file",{method:"PUT",body:JSON.stringify({path:n,content:r})})}async function Qf(n){return V("/workspace/attach",{method:"POST",body:JSON.stringify({path:n})})}function If(n,r="",i={}){let c=new URLSearchParams;if(r)c.set("path",r);if(i.overwrite)c.set("overwrite","1");let _=c.toString();return _?`${n}?${_}`:n}function Df(){if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();return`upload-${Date.now()}-${Math.random().toString(36).slice(2)}`}function Zf(n,r,i,c){return new Promise((_,u)=>{let f=new XMLHttpRequest;f.open("POST",a+r);for(let[o,s]of Object.entries(i||{}))if(s!==void 0&&s!==null)f.setRequestHeader(o,String(s));f.upload.onprogress=(o)=>{if(typeof c==="function")c({loaded:o.lengthComputable?o.loaded:0,total:o.lengthComputable?o.total:n.size,lengthComputable:o.lengthComputable})},f.onload=()=>{try{let o=f.responseText?JSON.parse(f.responseText):{};if(f.status>=200&&f.status<300)_(o);else{let s=Error(o.error||`HTTP ${f.status}`);s.status=f.status,s.code=o.code,u(s)}}catch{let o=Error(`HTTP ${f.status}`);o.status=f.status,u(o)}},f.onerror=()=>u(Error("Upload failed (network error)")),f.ontimeout=()=>u(Error("Upload timed out")),f.send(n)})}async function Yf(n,r="",i={}){let c=Df(),_=If("/workspace/upload-chunk",r,i),u=Math.max(1,Math.min(li,Number(i.chunkSize)||qf)),f=Math.max(0,Number(n?.size)||0),o=Math.max(1,Math.ceil(f/u)),s=0,g=null;for(let v=0;v<o;v+=1){let t=v*u,b=Math.min(f,t+u),h=n.slice(t,b),x=h.size;if(g=await Zf(h,_,{"X-Upload-Id":c,"X-Chunk-Index":v,"X-Chunk-Total":o,"X-File-Name":n?.name||"upload.bin","X-File-Size":f},(F)=>{if(typeof i.onProgress!=="function")return;let y=Math.min(f,s+(F?.loaded||0)),K=f||1;i.onProgress({loaded:y,total:K,percent:Math.round(y/K*100),chunkIndex:v,chunkTotal:o})}),s+=x,typeof i.onProgress==="function"){let F=f||1,y=f?s:F;i.onProgress({loaded:y,total:F,percent:Math.round(y/F*100),chunkIndex:v+1,chunkTotal:o})}}return g}async function Cf(n,r="",i={}){if(n?.size>li){let c=(n.size/1048576).toFixed(0),_=(li/1048576).toFixed(0),u=Error(`File too large (${c} MB). Maximum upload size is ${_} MB.`);throw u.code="file_too_large",u}return await Yf(n,r,i)}async function Of(n,r,i=""){let c=await fetch(a+"/workspace/file",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,name:r,content:i})});if(!c.ok){let _=await c.json().catch(()=>({error:"Create failed"})),u=Error(_.error||`HTTP ${c.status}`);throw u.status=c.status,u.code=_.code,u}return c.json()}async function ef(n,r){let i=await fetch(a+"/workspace/rename",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,name:r})});if(!i.ok){let c=await i.json().catch(()=>({error:"Rename failed"})),_=Error(c.error||`HTTP ${i.status}`);throw _.status=i.status,_.code=c.code,_}return i.json()}async function Jf(n,r){let i=await fetch(a+"/workspace/move",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,target:r})});if(!i.ok){let c=await i.json().catch(()=>({error:"Move failed"})),_=Error(c.error||`HTTP ${i.status}`);throw _.status=i.status,_.code=c.code,_}return i.json()}async function df(n){let r=`/workspace/file?path=${encodeURIComponent(n||"")}`;return V(r,{method:"DELETE"})}async function Ef(n,r=!1){return V("/workspace/visibility",{method:"POST",body:JSON.stringify({visible:Boolean(n),show_hidden:Boolean(r)})})}function qc(n,r={}){let i=new URLSearchParams({path:String(n||"")});if(r.download)i.set("download","1");return`${a}/workspace/raw?${i.toString()}`}function Sf(n){return qc(n,{download:!0})}function mf(n,r=!1){let i=`path=${encodeURIComponent(n||"")}&show_hidden=${r?"1":"0"}`;return`${a}/workspace/download?${i}`}class Ic{onEvent;onStatusChange;chatJid;eventSource;reconnectTimeout;reconnectDelay;status;reconnectAttempts;cooldownUntil;connecting;lastActivityAt;staleCheckTimer;staleThresholdMs;constructor(n,r,i={}){this.onEvent=n,this.onStatusChange=r,this.chatJid=typeof i?.chatJid==="string"&&i.chatJid.trim()?i.chatJid.trim():null,this.eventSource=null,this.reconnectTimeout=null,this.reconnectDelay=1000,this.status="disconnected",this.reconnectAttempts=0,this.cooldownUntil=0,this.connecting=!1,this.lastActivityAt=0,this.staleCheckTimer=null,this.staleThresholdMs=70000}markActivity(){this.lastActivityAt=Date.now()}clearStaleMonitor(){if(this.staleCheckTimer)clearInterval(this.staleCheckTimer),this.staleCheckTimer=null}startStaleMonitor(){this.clearStaleMonitor(),this.staleCheckTimer=setInterval(()=>{if(this.status!=="connected")return;if(!this.lastActivityAt)return;if(Date.now()-this.lastActivityAt<=this.staleThresholdMs)return;console.warn("SSE connection went stale; forcing reconnect"),this.forceReconnect()},15000)}forceReconnect(){if(this.connecting=!1,this.eventSource)this.eventSource.close(),this.eventSource=null;this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()}connect(){if(this.connecting)return;if(this.eventSource&&this.status==="connected")return;if(this.connecting=!0,this.eventSource)this.eventSource.close();this.clearStaleMonitor();let n=this.chatJid?`?chat_jid=${encodeURIComponent(this.chatJid)}`:"";this.eventSource=new EventSource(a+"/sse/stream"+n);let r=(i)=>{this.eventSource.addEventListener(i,(c)=>{this.markActivity(),this.onEvent(i,JSON.parse(c.data))})};this.eventSource.onopen=()=>{this.connecting=!1,this.reconnectDelay=1000,this.reconnectAttempts=0,this.cooldownUntil=0,this.status="connected",this.markActivity(),this.startStaleMonitor(),this.onStatusChange("connected")},this.eventSource.onerror=()=>{this.connecting=!1,this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()},this.eventSource.addEventListener("connected",()=>{this.markActivity(),console.log("SSE connected"),this.onEvent("connected",{})}),this.eventSource.addEventListener("heartbeat",()=>{this.markActivity()}),r("new_post"),r("new_reply"),r("agent_response"),r("interaction_updated"),r("interaction_deleted"),r("agent_status"),r("agent_steer_queued"),r("agent_followup_queued"),r("agent_followup_consumed"),r("agent_followup_removed"),r("workspace_update"),r("agent_draft"),r("agent_draft_delta"),r("agent_thought"),r("agent_thought_delta"),r("model_changed"),r("ui_theme"),r("ui_meters"),["extension_ui_request","extension_ui_timeout","extension_ui_notify","extension_ui_status","extension_ui_working","extension_ui_working_indicator","extension_ui_working_visible","extension_ui_widget","extension_ui_title","extension_ui_editor_text","extension_ui_error"].forEach(r)}scheduleReconnect(){if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout);let n=10,r=60000,i=Date.now();if(this.reconnectAttempts>=n)this.cooldownUntil=Math.max(this.cooldownUntil,i+r),this.reconnectAttempts=0;let c=Math.max(this.cooldownUntil-i,0),_=Math.max(this.reconnectDelay,c);this.reconnectTimeout=setTimeout(()=>{console.log("Reconnecting SSE..."),this.connect()},_),this.reconnectDelay=Math.min(this.reconnectDelay*2,30000)}reconnectIfNeeded(){let n=Date.now();if(this.status==="connected"){if(this.lastActivityAt&&n-this.lastActivityAt>this.staleThresholdMs)this.forceReconnect();return}if(this.cooldownUntil&&n<this.cooldownUntil)return;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null;this.connect()}disconnect(){if(this.connecting=!1,this.clearStaleMonitor(),this.eventSource)this.eventSource.close(),this.eventSource=null;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null}}async function af(n,r,i){let c=i?`?chat_jid=${encodeURIComponent(i)}`:"",_=await fetch(`${a}/post/${n}/annotations${c}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({annotations:r})});if(!_.ok){let u=await _.text().catch(()=>"");throw Error(`Failed to save annotations: ${_.status} ${u}`)}}var a="",li=1073741824,qf=8388608;var bn=Z(()=>{Mc()});function Cn(n){if(typeof window>"u"||!window.localStorage)return null;try{return window.localStorage.getItem(n)}catch{return null}}function ln(n,r){if(typeof window>"u"||!window.localStorage)return;try{window.localStorage.setItem(n,r)}catch{return}}function ki(n,r=!1){let i=Cn(n);if(i===null)return r;return i==="true"}function Bi(n,r=null){let i=Cn(n);if(i===null)return r;let c=parseInt(i,10);return Number.isFinite(c)?c:r}function Dc(n){let r=Cn(n);if(!r)return null;try{return JSON.parse(r)}catch{return null}}function il(n){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(Gr,{detail:{enabled:Boolean(n)}}))}function Cc(n){if(typeof fetch!=="function")return;hi({ui_meters:n}).catch((r)=>{console.debug("[meters] Failed to persist meters UI state.",r)})}function cl(n){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(rl,{detail:{collapsed:Boolean(n)}}))}function Ti(n=!1){return ki(Zc,n)}function T0(n=!1){return ki(Yc,n)}function Ur(n,r={}){let i=r.persist!==!1,c=r.persistServer!==!1,_=Boolean(n);if(i)ln(Zc,_?"true":"false");if(c)Cc({enabled:_});return il(_),_}function _l(n,r={}){let i=r.persist!==!1,c=r.persistServer!==!1,_=Boolean(n);if(i)ln(Yc,_?"true":"false");if(c)Cc({collapsed:_});return cl(_),_}function j0(n){let r=typeof n?.mode==="string"?n.mode.trim().toLowerCase():"";if(typeof n?.enabled==="boolean")Ur(Boolean(n.enabled),{persistServer:!1});else if(r==="toggle"){let i=!Ti(!1);Ur(i,{persistServer:!1})}if(typeof n?.collapsed==="boolean")_l(Boolean(n.collapsed),{persistServer:!1})}var Zc="piclaw_system_meters_enabled",Yc="piclaw_system_meters_collapsed",Gr="piclaw-meters-change",rl="piclaw-meters-collapsed-change";var Oc=Z(()=>{bn()});function ec(n,r){if(n===""||n===null||n===void 0)return r;let i=Number(n);return Number.isFinite(i)?i:r}function Jc(n,{min:r=-1/0,max:i=1/0}={}){let c=Number.isFinite(Number(r))?Number(r):-1/0,_=Number.isFinite(Number(i))?Number(i):1/0;return Math.min(_,Math.max(c,Number(n)))}function Kn(n,{fallback:r=0,min:i=-1/0,max:c=1/0}={}){let _=ec(n,r);return Jc(_,{min:i,max:c})}function ul(n,{direction:r=1,step:i=1,fallback:c=0,min:_=-1/0,max:u=1/0}={}){let f=Kn(n,{fallback:c,min:_,max:u}),o=Math.abs(ec(i,1))||1,s=Number(r)<0?-1:1;return Jc(f+s*o,{min:_,max:u})}function d({value:n,min:r,max:i,step:c=1,fallback:_,width:u="80px",disabled:f=!1,label:o,onChange:s}){let g=Number.isFinite(Number(_))?Number(_):Kn(n,{fallback:0,min:r,max:i}),[v,t]=$(String(n??g)),b=D(!1);M(()=>{if(!b.current)t(String(n??g))},[n,g]);let h=R((F)=>{b.current=!1;let y=Kn(F,{fallback:g,min:r,max:i});t(String(y)),s?.(y)},[g,r,i,s]),x=R((F)=>{b.current=!1;let y=ul(n,{direction:F,step:c,fallback:g,min:r,max:i});t(String(y)),s?.(y)},[g,i,r,s,c,n]);return l`
        <span class="settings-number-stepper">
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Decrease ${o||"value"}`}
                title=${`Decrease ${o||"value"}`}
                disabled=${f}
                onClick=${()=>x(-1)}
            >−</button>
            <input
                class="settings-number-input"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                value=${v}
                disabled=${f}
                style=${`width:${u}`}
                onInput=${(F)=>{b.current=!0,t(F.target.value)}}
                onBlur=${(F)=>h(F.target.value)}
                onKeyDown=${(F)=>{if(F.key==="Enter")F.preventDefault(),h(F.target.value),F.target.blur()}}
            />
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Increase ${o||"value"}`}
                title=${`Increase ${o||"value"}`}
                disabled=${f}
                onClick=${()=>x(1)}
            >+</button>
        </span>
    `}var Vn=Z(()=>{m()});function dc(n){let r=String(n||"").trim();if(!r)return"";if(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("data:")||r.startsWith("blob:"))return r;if(r.startsWith("/workspace/"))return`/workspace/file?path=${encodeURIComponent(r.slice(11))}`;if(r.startsWith("/"))return"";if(/^[a-zA-Z]:[\\/]/.test(r))return"";if(r.startsWith("\\\\"))return"";if(r.includes("\\"))return"";return`/workspace/file?path=${encodeURIComponent(r.replace(/^\.\//,""))}`}function Ec({value:n,onChange:r}){let i=D(null),[c,_]=$(dc(n));M(()=>{_(dc(n))},[n]);let u=R((f)=>{let o=f.target.files?.[0];if(!o)return;let s=new FileReader;s.onload=()=>{let g=s.result;_(g),r?.(g)},s.readAsDataURL(o)},[r]);return l`
        <div class="settings-avatar-inline" onClick=${()=>i.current?.click()} title="Click to upload">
            ${c?l`<img src=${c} alt="avatar" />`:l`<span class="settings-avatar-placeholder">+</span>`}
            <input type="file" accept="image/*" ref=${i} style="display:none" onChange=${u} />
        </div>
    `}function Sc(n={}){return{userName:n.userName||"",userAvatar:n.userAvatar||"",assistantName:n.assistantName||"",assistantAvatar:n.assistantAvatar||"",composeUploadLimitMb:n.composeUploadLimitMb??32,workspaceUploadLimitMb:n.workspaceUploadLimitMb??256}}async function fl(n,r={}){let i=typeof n==="string"?n:"";if(!i)return!1;let c=r.navigator??(typeof navigator<"u"?navigator:null),_=r.document??(typeof document<"u"?document:null);if(c?.clipboard?.writeText)try{return await c.clipboard.writeText(i),!0}catch(u){}try{if(!_?.body||typeof _.createElement!=="function"||typeof _.execCommand!=="function")return!1;let u=_.createElement("textarea");u.value=i,u.setAttribute?.("readonly",""),u.style.position="fixed",u.style.left="-9999px",u.style.top="0",u.style.opacity="0",_.body.appendChild(u),u.focus?.(),u.select?.();let f=Boolean(_.execCommand("copy"));return _.body.removeChild(u),f}catch(u){return!1}}function ji({settingsData:n,setStatus:r,mergeSettingsData:i}){let[c,_]=$(""),[u,f]=$(""),[o,s]=$(""),[g,v]=$(""),[t,b]=$(32),[h,x]=$(256),[F,y]=$(""),[K,T]=$(!1),[L,k]=$(!1),[U,z]=$(!1),[j,X]=$(()=>Ti(!1)),[w,G]=$(!1),B=D(""),p=D(null),H=D(!0);M(()=>{return H.current=!0,()=>{H.current=!1}},[]);let A=R((Y)=>{let P=Sc(Y);_(P.userName),f(P.userAvatar),s(P.assistantName),v(P.assistantAvatar),b(P.composeUploadLimitMb),x(P.workspaceUploadLimitMb),y(Y?.widgetToken||""),B.current=JSON.stringify(P)},[]);M(()=>{A(n||{})},[n,A]),M(()=>{let Y=(P)=>{X(Boolean(P?.detail?.enabled))};return window.addEventListener(Gr,Y),()=>window.removeEventListener(Gr,Y)},[]);let C=I(()=>JSON.stringify(Sc({userName:c,userAvatar:u,assistantName:o,assistantAvatar:g,composeUploadLimitMb:t,workspaceUploadLimitMb:h})),[c,u,o,g,t,h]);M(()=>{if(C===B.current)return;if(p.current)clearTimeout(p.current);return p.current=setTimeout(async()=>{if(!H.current)return;let Y=document.activeElement;if(Y&&Y.closest?.(".settings-number-stepper"))return;try{let P=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:C}),q=await P.json().catch(()=>({}));if(!H.current)return;if(!P.ok||!q?.ok||!q?.settings)return;B.current=C,i?.(q.settings),G(!0),setTimeout(()=>{if(H.current)G(!1)},4000)}catch(P){console.warn("[settings/general] Failed to persist general settings snapshot.",P)}},800),()=>{if(p.current)clearTimeout(p.current)}},[C,i]);let O=n?.instanceTotp||{configured:!1,issuer:o||"Piclaw",label:c?`${o||"Piclaw"}:${c}`:o||"Piclaw",secret:"",otpauth:"",qrSvg:""},gn=R(async()=>{if(!F)return;if(await fl(F))k(!0),setTimeout(()=>{if(H.current)k(!1)},3000);else r?.("Could not copy widget token. Select the token field and copy manually."),console.warn("[settings/general] Failed to copy widget token. Clipboard APIs unavailable or blocked.")},[F,r]),nn=R(async()=>{if(U)return;if(!confirm("Regenerate the widget token? Existing macOS widgets using the old token will stop updating."))return;z(!0);try{let Y=await fetch("/agent/settings/widget-token/regenerate",{method:"POST"}),P=await Y.json().catch(()=>({}));if(!Y.ok||!P?.ok||!P?.settings)throw Error(P?.error||"Failed to regenerate widget token.");y(P.settings.widgetToken||""),i?.(P.settings),G(!0),setTimeout(()=>{if(H.current)G(!1)},4000)}catch(Y){console.warn("[settings/general] Failed to regenerate widget token.",Y)}finally{if(H.current)z(!1)}},[U,i]),fn=typeof window<"u"&&window.isSecureContext,on=F?"•".repeat(Math.min(Math.max(F.length,16),48)):"—",wn=K?F||"—":on;return l`
        <div class="settings-section">
            ${w&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Identity</h3>
            <div class="settings-row">
                <label>User</label>
                <${Ec} value=${u} onChange=${f} />
                <input type="text" value=${c} onInput=${(Y)=>_(Y.target.value)} placeholder="Your name" />
            </div>
            <div class="settings-row">
                <label>Agent</label>
                <${Ec} value=${g} onChange=${v} />
                <input type="text" value=${o} onInput=${(Y)=>s(Y.target.value)} placeholder="Agent name" />
            </div>

            <h3 style="margin-top:20px">Notifications</h3>
            ${fn?l`
                <div class="settings-row">
                    <label>Browser notifications</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="settings-hint" style="margin:0">
                            Use the 🔔 bell button in the compose bar to enable/disable notifications.
                            Web Push requires HTTPS or localhost.
                        </span>
                    </div>
                </div>
            `:l`
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
                    <input type="checkbox" checked=${j}
                        onChange=${()=>{let Y=Ur(!j);X(Y)}} />
                    <span class="settings-hint" style="margin:0">CPU/memory/network meters in the status bar. This browser only.</span>
                </div>
            </div>

            <h3 style="margin-top:20px">Instance Configuration</h3>
            <div class="settings-row">
                <label>Compose upload (MB)</label>
                <${d}
                    label="compose upload limit"
                    value=${t}
                    min=${1}
                    max=${512}
                    fallback=${32}
                    width="80px"
                    onChange=${b}
                />
                <span class="settings-hint" style="margin:0">chat/media attachments</span>
            </div>
            <div class="settings-row">
                <label>Workspace upload (MB)</label>
                <${d}
                    label="workspace upload limit"
                    value=${h}
                    min=${1}
                    max=${1024}
                    fallback=${256}
                    width="80px"
                    onChange=${x}
                />
                <span class="settings-hint" style="margin:0">defaults to 256 MB; chunked uploads allow up to 1 GB</span>
            </div>

            <h3 style="margin-top:20px">Authentication</h3>
            <div class="settings-row settings-row-vertical settings-widget-token-row">
                <label>Widget bearer token</label>
                <div class="settings-keychain-reveal-panel settings-widget-token-panel">
                    <div class="settings-keychain-reveal-field settings-widget-token-field">
                        <span class="settings-keychain-reveal-label">Token</span>
                        <code class="settings-keychain-reveal-value settings-widget-token-value">${wn}</code>
                        <button class=${`settings-keychain-reveal-btn${K?" active":""}`}
                            type="button"
                            onClick=${()=>T((Y)=>!Y)}
                            disabled=${!F}
                            title=${K?"Hide token":"Reveal token"}>
                            ${K?l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                        </button>
                        <button class="settings-keychain-copy-btn" type="button" onClick=${gn} disabled=${!F} title="Copy token">
                            ${L?l`<span class="settings-widget-token-copied">Copied</span>`:l`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`}
                        </button>
                        <button class="settings-keychain-prompt-submit settings-widget-token-regenerate" type="button" onClick=${nn} disabled=${U}>${U?"Regenerating…":"Regenerate"}</button>
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
                            ${O.configured?"Current web-login authenticator secret. Scan this QR to add another authenticator device.":"TOTP is not configured for this instance yet, so no setup QR is available."}
                        </div>
                    </div>
                </div>
                ${O.configured?l`
                    <div class="settings-totp-grid">
                        <div class="settings-totp-qr" dangerouslySetInnerHTML=${{__html:O.qrSvg}}></div>
                        <div class="settings-totp-meta">
                            <div class="settings-row settings-row-vertical">
                                <label>Issuer</label>
                                <input type="text" readonly value=${O.issuer||""} />
                            </div>
                            <div class="settings-row settings-row-vertical">
                                <label>Label</label>
                                <input type="text" readonly value=${O.label||""} />
                            </div>
                            <div class="settings-row settings-row-vertical">
                                <label>Secret</label>
                                <input type="text" readonly value=${O.secret||""} />
                            </div>
                        </div>
                    </div>
                `:null}
            </div>
        </div>
    `}var mc=Z(()=>{m();Oc();Vn()});var n_={};cn(n_,{SessionsSection:()=>ll});function ac(n={}){return{sessionAutoRotate:n.sessionAutoRotate!==!1,sessionMaxSizeMb:n.sessionMaxSizeMb??16,sessionMaxLines:n.sessionMaxLines??4000,sessionMaxCompactions:n.sessionMaxCompactions??3,sessionIsolation:n.sessionIsolation||"none",toolUseBudget:n.toolUseBudget??64}}function ll({settingsData:n,setStatus:r,mergeSettingsData:i}){let[c,_]=$(!0),[u,f]=$(16),[o,s]=$(4000),[g,v]=$(3),[t,b]=$(64),[h,x]=$("none"),[F,y]=$(!1),K=D(""),T=D(null),L=D(!0);M(()=>{return L.current=!0,()=>{L.current=!1}},[]);let k=R((z)=>{let j=ac(z);_(j.sessionAutoRotate),f(j.sessionMaxSizeMb),s(j.sessionMaxLines),v(j.sessionMaxCompactions),b(j.toolUseBudget),x(j.sessionIsolation),K.current=JSON.stringify(j)},[]);M(()=>{k(n||{})},[n,k]);let U=I(()=>JSON.stringify(ac({sessionAutoRotate:c,sessionMaxSizeMb:u,sessionMaxLines:o,sessionMaxCompactions:g,toolUseBudget:t,sessionIsolation:h})),[c,u,o,g,t,h]);return M(()=>{if(U===K.current)return;if(T.current)clearTimeout(T.current);return T.current=setTimeout(async()=>{if(!L.current)return;let z=document.activeElement;if(z&&z.closest?.(".settings-number-stepper"))return;try{let j=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:U}),X=await j.json().catch(()=>({}));if(!L.current)return;if(!j.ok||!X?.ok||!X?.settings)return;K.current=U,i?.(X.settings),y(!0),setTimeout(()=>{if(L.current)y(!1)},4000)}catch(j){console.warn("[settings/sessions] Failed to persist session settings.",j)}},800),()=>{if(T.current)clearTimeout(T.current)}},[U,i]),l`
        <div class="settings-section">
            ${F&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Session Lifecycle</h3>
            <div class="settings-row">
                <label>Auto-rotate sessions</label>
                <input type="checkbox" checked=${c} onChange=${(z)=>_(z.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Max session size (MB)</label>
                <${d}
                    label="max session size"
                    value=${u}
                    min=${1}
                    max=${256}
                    fallback=${32}
                    width="80px"
                    onChange=${f}
                />
            </div>

            <h3 style="margin-top:20px">Agent Behaviour</h3>
            <div class="settings-row">
                <label>Tool use budget</label>
                <${d}
                    label="tool use budget"
                    value=${t}
                    min=${8}
                    max=${512}
                    fallback=${64}
                    width="80px"
                    onChange=${b}
                />
                <span class="settings-hint" style="margin:0">max tool-call messages per turn</span>
            </div>
            <div class="settings-row">
                <label>Session isolation</label>
                <select value=${h} onChange=${(z)=>x(z.target.value)}>
                    <option value="none">None — full cross-session visibility</option>
                    <option value="summary">Summary — tools visible, no arguments</option>
                    <option value="full">Full — sessions cannot see each other</option>
                </select>
            </div>
        </div>
    `}var r_=Z(()=>{m();Vn()});var i_={};cn(i_,{__recordingsSettingsTest:()=>gl,RecordingsSection:()=>tl});function Lr(n){if(!n)return"—";let r=new Date(n);if(Number.isNaN(r.getTime()))return n;return r.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Wi(n){if(n==="full")return"full / trusted";if(n==="metadata")return"metadata only";return"redacted"}function Hr({children:n,type:r="neutral"}){return l`<span class=${`settings-task-pill settings-task-pill-${r}`}>${n}</span>`}function ol(){if(typeof window>"u")return"web:default";return String(window.__piclawCurrentChatJid||"web:default")}function fr(n){return String(n||"").split(`
`).map((r)=>r.trim()).filter(Boolean)}function sl({recording:n,details:r,onDelete:i,onRefresh:c}){if(!n)return l`<div class="settings-task-detail-empty">Select a recording to inspect, replay, export, or delete it.</div>`;let _=r?.meta||n,u=Array.isArray(r?.events)?r.events:[],f=u.reduce((s,g)=>s+(Array.isArray(g.redactions)?g.redactions.length:0),0),o=u.reduce((s,g)=>{let v=g.kind||"event";return s[v]=(s[v]||0)+1,s},{});return l`
        <div class="settings-task-detail settings-recording-detail">
            <div class="settings-task-detail-header">
                <div>
                    <h4>${_.title||_.id}</h4>
                    <code>${_.id}</code>
                </div>
                <div class="settings-task-detail-actions">
                    <button onClick=${()=>window.open(yi(_.id),"_blank","noopener,noreferrer")}>Playback</button>
                    <button onClick=${c}>Refresh</button>
                    <button class="danger" onClick=${()=>i(_)}>Delete</button>
                </div>
            </div>
            <div class="settings-task-detail-grid">
                <span>Status</span><strong>${_.status||"—"}</strong>
                <span>Mode</span><strong>${Wi(_.mode)}</strong>
                <span>Chat</span><code>${_.chatJid||"—"}</code>
                <span>Started</span><strong>${Lr(_.startedAt)}</strong>
                <span>Ended</span><strong>${Lr(_.endedAt)}</strong>
                <span>Events</span><strong>${_.eventCount??u.length}</strong>
                <span>Redactions</span><strong>${f}</strong>
            </div>
            <div class="settings-recording-export-row">
                <a href=${ur(_.id,"json")}>Export JSON</a>
                <a href=${ur(_.id,"jsonl")}>Export JSONL</a>
                <a href=${ur(_.id,"html")}>Export standalone HTML</a>
            </div>
            <h4>Event summary</h4>
            ${u.length===0&&l`<p class="settings-hint">Open or refresh details to inspect trace events.</p>`}
            ${u.length>0&&l`
                <div class="settings-recording-event-summary">
                    ${Object.entries(o).map(([s,g])=>l`<${Hr}>${s}: ${g}<//>`)}
                </div>
                <div class="settings-task-command-block">
                    <strong>First events</strong>
                    <pre>${JSON.stringify(u.slice(0,5),null,2)}</pre>
                </div>
            `}
        </div>
    `}function tl({filter:n="",setStatus:r}){let[i,c]=$([]),[_,u]=$([]),[f,o]=$(!0),[s,g]=$(null),[v,t]=$(null),[b,h]=$(null),[x,F]=$(!1),[y,K]=$(ol),[T,L]=$(""),[k,U]=$("redacted"),[z,j]=$(!0),[X,w]=$(""),[G,B]=$(""),[p,H]=$('{"Authorization":"Bearer abc1234567890","content":"hello"}'),[A,C]=$(null);M(()=>{let N=(E)=>{let un=String(E?.detail?.chatJid||"").trim();if(un)K(un)};return window.addEventListener("piclaw:current-chat-changed",N),()=>window.removeEventListener("piclaw:current-chat-changed",N)},[]);let O=R(async(N=v)=>{o(!0),g(null);try{let E=await ti(),un=E.recordings||[];c(un),u(E.active||[]);let kn=un.find((W)=>W.id===N)||un[0]||null;if(t(kn?.id||null),kn?.id)h(await Wr(kn.id));else h(null)}catch(E){g(E?.message||"Failed to load recordings.")}finally{o(!1)}},[v]);M(()=>{O()},[O]);let gn=I(()=>i.find((N)=>N.id===v)||null,[i,v]),nn=I(()=>_.find((N)=>N.chatJid===y)||null,[_,y]),fn=String(n||"").trim().toLowerCase(),on=I(()=>{if(!fn)return i;return i.filter((N)=>[N.id,N.title,N.chatJid,N.status,N.mode].some((E)=>String(E||"").toLowerCase().includes(fn)))},[i,fn]),wn=R(async(N)=>{if(t(N?.id||null),h(null),!N?.id)return;try{h(await Wr(N.id))}catch(E){r?.(E?.message||"Failed to load recording.","error")}},[r]),Y=R(async()=>{if(x)return;F(!0);try{let N={keys:fr(X),patterns:fr(G)},E=await gi({chat_jid:y,title:T||void 0,mode:k,include_timeline_snapshot:z,timeline_snapshot_limit:80,redaction:N});r?.(`Recording started for ${y}.`,"success"),await O(E?.recording?.id)}catch(N){r?.(N?.message||"Failed to start recording.","error")}finally{F(!1)}},[x,y,X,G,z,O,k,r,T]),P=R(async(N=nn)=>{if(!N||x)return;F(!0);try{let E=await $i({id:N.id});r?.(`Recording stopped for ${N.chatJid}.`,"success"),await O(E?.recording?.id)}catch(E){r?.(E?.message||"Failed to stop recording.","error")}finally{F(!1)}},[x,nn,O,r]),q=R(async(N)=>{if(!N||x)return;if(!window.confirm(`Delete recording ${N.id}?

${N.title||""}`))return;F(!0);try{await wi(N.id),r?.("Recording deleted.","success"),await O(null)}catch(E){r?.(E?.message||"Failed to delete recording.","error")}finally{F(!1)}},[x,O,r]),_n=R(async()=>{try{let N=JSON.parse(p||"null"),E=await pi(N,{mode:k,redaction:{keys:fr(X),patterns:fr(G)}});C(E.preview)}catch(N){C({error:N?.message||"Preview failed."})}},[X,G,k,p]);return l`
        <div class="settings-section settings-recordings-section">
            <div class="settings-recording-start-card">
                <h3>Session Recording</h3>
                <p class="settings-hint">Opt-in trace capture for deterministic playback and screen-recording exports. Playback never calls live agent or tool endpoints.</p>
                <div class="settings-recording-form-grid">
                    <label>Chat JID<input value=${y} onInput=${(N)=>K(N.target.value)} /></label>
                    <label>Title<input placeholder="Demo recording" value=${T} onInput=${(N)=>L(N.target.value)} /></label>
                    <label>Mode<select value=${k} onChange=${(N)=>U(N.target.value)}><option value="redacted">Redacted</option><option value="metadata">Metadata only</option><option value="full">Full / trusted local</option></select></label>
                    <label class="settings-recording-checkbox"><input type="checkbox" checked=${z} onChange=${(N)=>j(N.target.checked)} /> Include timeline snapshot</label>
                </div>
                <div class="settings-recording-form-grid settings-recording-redaction-grid">
                    <label>Extra redacted keys<textarea rows="2" placeholder="customer_id\ninternal_code" value=${X} onInput=${(N)=>w(N.target.value)} /></label>
                    <label>Extra regex patterns<textarea rows="2" placeholder="ACME-[0-9]+" value=${G} onInput=${(N)=>B(N.target.value)} /></label>
                </div>
                <div class="settings-task-detail-actions">
                    ${nn?l`<button onClick=${()=>P(nn)} disabled=${x}>Stop current chat recording</button>`:l`<button onClick=${Y} disabled=${x}>Start recording</button>`}
                    <button onClick=${()=>O()} disabled=${f}>Refresh</button>
                </div>
                ${_.length>0&&l`<div class="settings-recording-active-row">${_.map((N)=>l`<${Hr} type="active">REC ${N.chatJid}<//>`)}</div>`}
            </div>

            <details class="settings-recording-preview">
                <summary>Redaction preview</summary>
                <textarea rows="4" value=${p} onInput=${(N)=>H(N.target.value)} />
                <div class="settings-task-detail-actions"><button onClick=${_n}>Preview redaction</button></div>
                ${A&&l`<pre>${JSON.stringify(A,null,2)}</pre>`}
            </details>

            ${f&&l`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading recordings…</span></div>`}
            ${s&&l`<div class="settings-error-state">${s}</div>`}
            ${!f&&!s&&i.length===0&&l`<div class="settings-empty-state"><strong>No recordings yet.</strong><p>Start a recording above, then use playback/export for deterministic screen capture.</p></div>`}
            ${!f&&!s&&i.length>0&&l`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Session recordings">
                        ${on.map((N)=>l`
                            <button class=${`settings-task-row ${N.id===v?"active":""}`} onClick=${()=>wn(N)}>
                                <span class="settings-task-row-main"><strong>${N.title||N.id}</strong><span>${N.chatJid} · ${Lr(N.startedAt)}</span></span>
                                <span class="settings-task-row-meta"><${Hr} type=${N.status==="recording"?"active":"completed"}>${N.status}<//><${Hr}>${Wi(N.mode)}<//></span>
                                <span class="settings-task-row-times">${N.eventCount||0} events</span>
                            </button>
                        `)}
                        ${on.length===0&&l`<p class="settings-hint">No recordings match “${n}”.</p>`}
                    </div>
                    <${sl} recording=${gn} details=${b} onDelete=${q} onRefresh=${()=>gn&&wn(gn)} />
                </div>
            `}
        </div>
    `}var gl;var c_=Z(()=>{m();bn();gl={formatDateTime:Lr,modeLabel:Wi,parseList:fr}});var __={};cn(__,{CompactionSection:()=>wl});function $l(n={}){return{compactionTimeoutSec:n.compactionTimeoutSec??180,compactionBackoffBaseMin:n.compactionBackoffBaseMin??15,compactionBackoffMaxMin:n.compactionBackoffMaxMin??360,compactionThresholdPercent:n.compactionThresholdPercent??75,compactionBackoffDecayFactor:n.compactionBackoffDecayFactor??0.5,toolResultCompactionEnabled:Boolean(n.toolResultCompactionEnabled??!0),toolResultSemanticSummaryEnabled:Boolean(n.toolResultSemanticSummaryEnabled??!0),toolResultSemanticSummaryMaxInputChars:n.toolResultSemanticSummaryMaxInputChars??12000,toolResultSemanticSummaryMaxTokens:n.toolResultSemanticSummaryMaxTokens??320,toolResultSemanticSummaryTimeoutSec:n.toolResultSemanticSummaryTimeoutSec??12,progressWatchdogEnabled:Boolean(n.progressWatchdogEnabled??!1),progressWatchdogTimeoutSec:n.progressWatchdogTimeoutSec??120,compactionBackoffs:Array.isArray(n.compactionBackoffs)?n.compactionBackoffs:[],progressWatchdogPhases:Array.isArray(n.progressWatchdogPhases)?n.progressWatchdogPhases:[]}}function Ri(n){let r=String(n||"").trim();if(!r)return"—";let i=new Date(r);if(Number.isNaN(i.getTime()))return r;return i.toLocaleString()}function wl({settingsData:n,setStatus:r,mergeSettingsData:i}){let[c,_]=$(180),[u,f]=$(15),[o,s]=$(360),[g,v]=$(75),[t,b]=$(0.5),[h,x]=$(!0),[F,y]=$(!0),[K,T]=$(12000),[L,k]=$(320),[U,z]=$(12),[j,X]=$(!1),[w,G]=$(120),[B,p]=$([]),[H,A]=$([]),[C,O]=$(!1),gn=D(""),nn=D(null),fn=D(!0);M(()=>{return fn.current=!0,()=>{fn.current=!1}},[]);let on=R((P)=>{let q=$l(P);_(q.compactionTimeoutSec),f(q.compactionBackoffBaseMin),s(q.compactionBackoffMaxMin),v(q.compactionThresholdPercent),b(q.compactionBackoffDecayFactor),x(q.toolResultCompactionEnabled),y(q.toolResultSemanticSummaryEnabled),T(q.toolResultSemanticSummaryMaxInputChars),k(q.toolResultSemanticSummaryMaxTokens),z(q.toolResultSemanticSummaryTimeoutSec),X(q.progressWatchdogEnabled),G(q.progressWatchdogTimeoutSec),p(q.compactionBackoffs),A(q.progressWatchdogPhases),gn.current=JSON.stringify({compactionTimeoutSec:q.compactionTimeoutSec,compactionBackoffBaseMin:q.compactionBackoffBaseMin,compactionBackoffMaxMin:q.compactionBackoffMaxMin,compactionThresholdPercent:q.compactionThresholdPercent,compactionBackoffDecayFactor:q.compactionBackoffDecayFactor,toolResultCompactionEnabled:q.toolResultCompactionEnabled,toolResultSemanticSummaryEnabled:q.toolResultSemanticSummaryEnabled,toolResultSemanticSummaryMaxInputChars:q.toolResultSemanticSummaryMaxInputChars,toolResultSemanticSummaryMaxTokens:q.toolResultSemanticSummaryMaxTokens,toolResultSemanticSummaryTimeoutSec:q.toolResultSemanticSummaryTimeoutSec,progressWatchdogEnabled:q.progressWatchdogEnabled,progressWatchdogTimeoutSec:q.progressWatchdogTimeoutSec})},[]);M(()=>{on(n||{})},[n,on]);let wn=I(()=>JSON.stringify({compactionTimeoutSec:c,compactionBackoffBaseMin:u,compactionBackoffMaxMin:o,compactionThresholdPercent:g,compactionBackoffDecayFactor:t,toolResultCompactionEnabled:h,toolResultSemanticSummaryEnabled:F,toolResultSemanticSummaryMaxInputChars:K,toolResultSemanticSummaryMaxTokens:L,toolResultSemanticSummaryTimeoutSec:U,progressWatchdogEnabled:j,progressWatchdogTimeoutSec:w}),[c,u,o,g,t,h,F,K,L,U,j,w]);M(()=>{if(wn===gn.current)return;if(nn.current)clearTimeout(nn.current);return nn.current=setTimeout(async()=>{if(!fn.current)return;let P=document.activeElement;if(P&&P.closest?.(".settings-number-stepper"))return;try{r?.("Saving compaction settings…","info");let q=await fetch("/agent/settings/compaction",{method:"POST",headers:{"Content-Type":"application/json"},body:wn}),_n=await q.json().catch(()=>({}));if(!fn.current)return;if(!q.ok||!_n?.ok||!_n?.settings){r?.(_n?.error||"Failed to save compaction settings.","error");return}gn.current=wn,i?.(_n.settings),on({...n||{},..._n.settings||{}}),r?.("Compaction settings saved.","success"),O(!0),setTimeout(()=>{if(fn.current)O(!1),r?.(null)},4000)}catch(q){if(console.warn("[settings/compaction] Failed to persist compaction settings.",q),fn.current)r?.("Failed to save compaction settings.","error")}},800),()=>{if(nn.current)clearTimeout(nn.current)}},[wn,i,r,on,n]);let Y=R(async(P)=>{try{r?.(`Clearing compaction suppression for ${P}…`,"info");let q=await fetch("/agent/settings/compaction/reset-backoff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatJid:P})}),_n=await q.json().catch(()=>({}));if(!q.ok||!_n?.ok||!_n?.settings){r?.(_n?.error||"Failed to clear compaction suppression.","error");return}i?.(_n.settings),on({...n||{},..._n.settings||{}}),r?.(`Cleared compaction suppression for ${P}.`,"success")}catch(q){console.warn("[settings/compaction] Failed to clear compaction suppression.",q),r?.("Failed to clear compaction suppression.","error")}},[on,i,r,n]);return l`
        <div class="settings-section">
            ${C&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Compaction settings applied. Existing turns keep their current timers; new turns use the updated values.
                </div>
            `}

            <h3>Automatic compaction</h3>
            <div class="settings-row">
                <label>Enable tool-result compaction</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${h} onChange=${(P)=>x(Boolean(P.target.checked))} />
                    <span class="settings-hint" style="margin:0">When disabled, large tool results stay inline and are not externalized into searchable tool-output handles.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Semantic summaries for compacted tool results</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${F} onChange=${(P)=>y(Boolean(P.target.checked))} />
                    <span class="settings-hint" style="margin:0">When enabled, compacted outputs include a semantic summary generated with the active model (preview fallback on failure).</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Semantic summary input limit (chars)</label>
                <${d}
                    label="semantic summary input limit"
                    value=${K}
                    min=${500}
                    max=${200000}
                    fallback=${12000}
                    width="100px"
                    disabled=${!F}
                    onChange=${T}
                />
                <span class="settings-hint" style="margin:0">Maximum characters sampled from full tool output for semantic summarization.</span>
            </div>
            <div class="settings-row">
                <label>Semantic summary output max tokens</label>
                <${d}
                    label="semantic summary max tokens"
                    value=${L}
                    min=${64}
                    max=${4096}
                    fallback=${320}
                    width="90px"
                    disabled=${!F}
                    onChange=${k}
                />
                <span class="settings-hint" style="margin:0">Upper bound for generated summary length.</span>
            </div>
            <div class="settings-row">
                <label>Semantic summary timeout (sec)</label>
                <${d}
                    label="semantic summary timeout"
                    value=${U}
                    min=${1}
                    max=${300}
                    fallback=${12}
                    width="90px"
                    disabled=${!F}
                    onChange=${z}
                />
                <span class="settings-hint" style="margin:0">Abort semantic summary generation after this timeout and fall back to preview compaction.</span>
            </div>
            <div class="settings-row">
                <label>Compaction threshold (%)</label>
                <${d}
                    label="compaction threshold"
                    value=${g}
                    min=${10}
                    max=${95}
                    fallback=${75}
                    width="80px"
                    onChange=${v}
                />
                <span class="settings-hint" style="margin:0">auto-compact when context exceeds this % of window</span>
            </div>
            <div class="settings-row">
                <label>Compaction timeout (sec)</label>
                <${d}
                    label="compaction timeout"
                    value=${c}
                    min=${1}
                    max=${3600}
                    fallback=${180}
                    width="90px"
                    onChange=${_}
                />
                <span class="settings-hint" style="margin:0">Abort a stuck pre-prompt/manual compaction instead of hanging forever.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff base (min)</label>
                <${d}
                    label="compaction backoff base"
                    value=${u}
                    min=${1}
                    max=${1440}
                    fallback=${15}
                    width="90px"
                    onChange=${f}
                />
                <span class="settings-hint" style="margin:0">First suppression window after a compaction failure.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff max (min)</label>
                <${d}
                    label="compaction backoff max"
                    value=${o}
                    min=${1}
                    max=${10080}
                    fallback=${360}
                    width="90px"
                    onChange=${s}
                />
                <span class="settings-hint" style="margin:0">Upper bound for exponential suppression after repeated failures.</span>
            </div>

            <div class="settings-row">
                <label>Backoff decay factor</label>
                <${d}
                    label="backoff decay factor"
                    value=${Math.round(t*100)}
                    min=${10}
                    max=${100}
                    fallback=${50}
                    width="80px"
                    onChange=${(P)=>b(P/100)}
                />
                <span class="settings-hint" style="margin:0">% — halves backoff after each successful compaction</span>
            </div>

            <h3 style="margin-top:20px">Stall watchdog</h3>
            <div class="settings-row">
                <label>Enable watchdog</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${j} onChange=${(P)=>X(Boolean(P.target.checked))} />
                    <span class="settings-hint" style="margin:0">Disabled by default. When enabled, a helper process terminates the runtime if an active phase stops heartbeating.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Watchdog timeout (sec)</label>
                <${d}
                    label="watchdog timeout"
                    value=${w}
                    min=${0}
                    max=${3600}
                    fallback=${120}
                    width="90px"
                    disabled=${!j}
                    onChange=${G}
                />
                <span class="settings-hint" style="margin:0">How long an active phase can go without a heartbeat before the watchdog kills the runtime.</span>
            </div>

            <h3 style="margin-top:20px">Active compaction suppressions</h3>
            ${B.length===0?l`
                <p class="settings-hint">No chats are currently under compaction backoff.</p>
            `:l`
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
                            ${B.map((P)=>l`
                                <tr>
                                    <td><code>${P.chatJid}</code></td>
                                    <td>${P.failureCount}</td>
                                    <td>${Ri(P.backoffUntil)}</td>
                                    <td title=${P.lastErrorMessage||""}>${P.lastErrorMessage||"—"}</td>
                                    <td>
                                        <button class="settings-secondary-btn" onClick=${()=>Y(P.chatJid)}>
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
            ${H.length===0?l`
                <p class="settings-hint">No active tracked phases right now.</p>
            `:l`
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
                            ${H.map((P)=>l`
                                <tr>
                                    <td><code>${P.chatJid}</code></td>
                                    <td>${P.phase}</td>
                                    <td>${Ri(P.startedAt)}</td>
                                    <td>${Ri(P.lastProgressAt)}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `}var u_=Z(()=>{m();Vn()});function l_(n){let r=String(n||"").trim().toLowerCase();if(!r)return null;let i=hl[r]||r;if(/^f(?:[1-9]|1[0-2])$/.test(i))return i;if(xl.has(i))return i;if(i.length===1)return i;if(/^[a-z0-9]+$/.test(i))return i;return null}function On(n){let r=String(n||"").trim();if(!r)return null;let i=r.split("+").map((u)=>u.trim()).filter(Boolean);if(!i.length)return null;let c={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let u of i){let f=u.toLowerCase(),o=pl[f];if(o){c[o]=!0;continue}if(c.key)return null;let s=l_(u);if(!s||s==="escape")return null;c.key=s}if(!c.key)return null;let _=[];if(c.ctrl)_.push("ctrl");if(c.meta)_.push("meta");if(c.alt)_.push("alt");if(c.shift)_.push("shift");return _.push(c.key),_.join("+")}function o_(n){return String(n||"").split(/[\n,]/).map((r)=>On(r)).filter((r)=>Boolean(r))}function Wn(n){return n.join(", ")}function Gi(){let n=Dc(f_);if(!n||typeof n!=="object")return{};let r={};for(let i of lr){let c=n[i.id];if(!Array.isArray(c))continue;let _=c.map((u)=>On(String(u||""))).filter((u)=>Boolean(u));r[i.id]=[...new Set(_)]}return r}function Ui(n){if(ln(f_,JSON.stringify(n)),typeof window<"u")window.dispatchEvent(new CustomEvent("piclaw:keyboard-shortcuts-changed",{detail:{config:n}}))}function s_(n){return yl.get(n)}function or(n){let r=Gi()[n];if(Array.isArray(r))return r;return[...s_(n).defaultBindings]}function t_(n,r){let i=Gi(),c=s_(n).defaultBindings,_=[...new Set(r.map((u)=>On(u)).filter((u)=>Boolean(u)))];if(_.length===c.length&&_.every((u,f)=>u===c[f]))delete i[n];else i[n]=_;Ui(i)}function Hi(n){if(!n){Ui({});return}let r=Gi();delete r[n],Ui(r)}function Nr(){let n={};for(let r of lr)n[r.id]=or(r.id);return n}function vl(n){let r=typeof n==="string"?n:"";if(!r)return"";if(r.length===1)return r.toLowerCase();return l_(r)||r.toLowerCase()}function bl(n){let r=On(n);if(!r)return null;let i={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let c of r.split("+")){if(c==="ctrl"||c==="meta"||c==="alt"||c==="shift"){i[c]=!0;continue}i.key=c}return i.key?i:null}function Kl(n,r){let i=bl(r);if(!i)return!1;if(vl(n?.key)!==i.key)return!1;let _=!i.shift&&i.key.length===1&&/[^a-z0-9]/i.test(i.key);return Boolean(n?.ctrlKey)===i.ctrl&&Boolean(n?.metaKey)===i.meta&&Boolean(n?.altKey)===i.alt&&(_||Boolean(n?.shiftKey)===i.shift)}function I0(n,r){return or(r).some((i)=>Kl(n,i))}var f_="piclaw_keyboard_shortcuts_v1",lr,yl,pl,hl,xl;var g_=Z(()=>{lr=[{id:"openHelp",label:"Open keyboard help",description:"Open Settings → Keyboard. Default: question mark and quote when focus is outside compose and other editable fields.",defaultBindings:["?",'"']},{id:"openSettings",label:"Open settings",description:"Open the settings dialog.",defaultBindings:["ctrl+,","meta+,","alt+,"]},{id:"previousChat",label:"Previous session",description:"Switch to the previous visible chat/session.",defaultBindings:["["]},{id:"nextChat",label:"Next session",description:"Switch to the next visible chat/session.",defaultBindings:["]"]},{id:"toggleDock",label:"Toggle dock",description:"Show or hide the bottom dock panes.",defaultBindings:["ctrl+`"]},{id:"toggleZenMode",label:"Toggle zen mode",description:"Collapse surrounding chrome for a focused chat view.",defaultBindings:["ctrl+shift+z","meta+shift+z"]}],yl=new Map(lr.map((n)=>[n.id,n])),pl={cmd:"meta",command:"meta",meta:"meta",super:"meta",ctrl:"ctrl",control:"ctrl",alt:"alt",option:"alt",shift:"shift"},hl={esc:"escape",return:"enter",spacebar:"space"},xl=new Set(["tab","enter","space","backspace","delete","insert","clear","home","end","pageup","pagedown","up","down","left","right"])});var $_={};cn($_,{KeyboardSection:()=>Fl});function zl(n,r,i){let c=String(n||"").trim().toLowerCase();if(!c)return!0;return[r.label,r.description,i,...r.defaultBindings||[]].some((_)=>String(_||"").toLowerCase().includes(c))}function Fl({filter:n="",setStatus:r}){let[i,c]=$(()=>{let s=Nr();return Object.fromEntries(Object.entries(s).map(([g,v])=>[g,Wn(v)]))});M(()=>{let s=()=>{let g=Nr();c(Object.fromEntries(Object.entries(g).map(([v,t])=>[v,Wn(t)])))};return window.addEventListener("piclaw:keyboard-shortcuts-changed",s),()=>window.removeEventListener("piclaw:keyboard-shortcuts-changed",s)},[]);let _=I(()=>lr.filter((s)=>{let g=String(i[s.id]||"");return zl(n,s,g)}),[i,n]),u=(s)=>{let g=String(i[s]||"").trim(),t=(g?g.split(/[\n,]/).map((h)=>h.trim()).filter(Boolean):[]).filter((h)=>!On(h));if(t.length>0){r?.(`Invalid shortcut: ${t[0]}. Escape is reserved and cannot be rebound.`,"error");return}let b=o_(g);t_(s,b),c((h)=>({...h,[s]:Wn(or(s))})),r?.("Keyboard shortcuts saved.","success")},f=(s)=>{Hi(s),c((g)=>({...g,[s]:Wn(or(s))})),r?.("Keyboard shortcut reset to default.","success")};return l`
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
                <button class="settings-addon-btn" style="min-width:180px; height:40px; font-size:14px;" onClick=${()=>{Hi();let s=Nr();c(Object.fromEntries(Object.entries(s).map(([g,v])=>[g,Wn(v)]))),r?.("Keyboard shortcuts reset to defaults.","success")}}>Reset all to defaults</button>
            </div>

            <div class="settings-shortcut-list" style="display:grid; gap:16px;">
                ${_.map((s)=>l`
                    <div class="settings-shortcut-card" key=${s.id} style="display:grid; grid-template-columns:minmax(240px, 1.25fr) minmax(320px, 1fr); gap:18px; align-items:start; padding:18px 20px; border:1px solid var(--border-color, rgba(120,120,120,.22)); border-radius:16px; background:var(--panel-bg, rgba(255,255,255,.04));">
                        <div class="settings-shortcut-copy" style="min-width:0;">
                            <div class="settings-shortcut-title" style="font-size:17px; font-weight:700; line-height:1.3;">${s.label}</div>
                            <div class="settings-hint" style="margin:6px 0 0 0; font-size:14px; line-height:1.5;">${s.description}</div>
                            <div class="settings-shortcut-default" style="margin-top:10px; font-size:13px; color:var(--text-secondary);">Default: <code style="font-size:13px;">${Wn(s.defaultBindings)}</code></div>
                        </div>
                        <div class="settings-shortcut-controls" style="display:grid; gap:10px; min-width:0;">
                            <input
                                type="text"
                                value=${i[s.id]||""}
                                placeholder=${Wn(s.defaultBindings)}
                                onInput=${(g)=>c((v)=>({...v,[s.id]:g.target.value}))}
                                style="width:100%; min-height:46px; padding:10px 14px; font-size:16px; line-height:1.35; font-family:var(--font-mono, ui-monospace, monospace); border-radius:12px;"
                            />
                            <div class="settings-shortcut-actions" style="display:flex; justify-content:flex-end; align-items:center; gap:10px; flex-wrap:wrap;">
                                <button class="settings-addon-btn settings-addon-btn-install" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>u(s.id)}>Save</button>
                                <button class="settings-addon-btn" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>f(s.id)}>Default</button>
                            </div>
                        </div>
                    </div>
                `)}
                ${_.length===0&&l`<div class="settings-hint">No shortcuts match this filter.</div>`}
            </div>
        </div>
    `}var w_=Z(()=>{m();g_()});function h_(n,r=Li){let i=Number(n);if(!Number.isFinite(i))return r;return Math.min(300,Math.max(15,Math.round(i)))}function x_(n,r=Ni){let i=Number(n);if(!Number.isFinite(i))return r;return Math.min(8,Math.max(0,Math.round(i)))}function Vi(){return{refreshIntervalSec:h_(Bi(y_,Li),Li),folderPreviewDepth:x_(Bi(p_,Ni),Ni)}}function v_(n={}){let r=Vi(),i={refreshIntervalSec:h_(Object.prototype.hasOwnProperty.call(n,"refreshIntervalSec")?n.refreshIntervalSec:r.refreshIntervalSec,r.refreshIntervalSec),folderPreviewDepth:x_(Object.prototype.hasOwnProperty.call(n,"folderPreviewDepth")?n.folderPreviewDepth:r.folderPreviewDepth,r.folderPreviewDepth)};if(ln(y_,String(i.refreshIntervalSec)),ln(p_,String(i.folderPreviewDepth)),typeof window<"u")window.dispatchEvent(new CustomEvent(kl,{detail:{settings:i}}));return i}var kl="piclaw:workspace-client-settings-updated",y_="workspaceRefreshIntervalSec",p_="workspaceFolderPreviewDepth",Li=60,Ni=3;var b_=()=>{};var z_={};cn(z_,{WorkspaceSection:()=>Bl});function K_(n={}){let r=n.workspaceSettings||{};return{webTerminalEnabled:r.webTerminalEnabled!==!1,vncAllowDirect:r.vncAllowDirect!==!1,treeMaxDepth:r.treeMaxDepth??4,treeMaxEntries:r.treeMaxEntries??5000}}function Bl({settingsData:n,setStatus:r,mergeSettingsData:i}){let[c,_]=$(!0),[u,f]=$(!0),[o,s]=$(4),[g,v]=$(5000),[t,b]=$(60),[h,x]=$(3),[F,y]=$(!1),[K,T]=$(!1),L=D(""),k=D(null),U=D(null),z=D(null),j=D(!0);M(()=>{return j.current=!0,()=>{if(j.current=!1,k.current)clearTimeout(k.current);if(U.current)clearTimeout(U.current);if(z.current)clearTimeout(z.current)}},[]);let X=R((B)=>{let p=K_(B),H=Vi();_(p.webTerminalEnabled),f(p.vncAllowDirect),s(p.treeMaxDepth),v(p.treeMaxEntries),b(H.refreshIntervalSec),x(H.folderPreviewDepth),L.current=JSON.stringify(p)},[]);M(()=>{X(n||{})},[n,X]);let w=I(()=>JSON.stringify(K_({workspaceSettings:{webTerminalEnabled:c,vncAllowDirect:u,treeMaxDepth:o,treeMaxEntries:g}})),[c,u,o,g]);M(()=>{if(w===L.current)return;if(k.current)clearTimeout(k.current);return k.current=setTimeout(async()=>{if(!j.current)return;let B=document.activeElement;if(B&&B.closest?.(".settings-number-stepper"))return;try{let p=await Ki(JSON.parse(w));if(!j.current||!p?.ok||!p?.settings)return;if(L.current=w,i?.({workspaceSettings:p.settings}),r?.(null),y(!0),U.current)clearTimeout(U.current);U.current=setTimeout(()=>{if(j.current)y(!1)},4000)}catch(p){r?.(String(p?.message||p),"error")}},800),()=>{if(k.current)clearTimeout(k.current)}},[w,i,r]);let G=R((B)=>{let p=v_(B);if(b(p.refreshIntervalSec),x(p.folderPreviewDepth),T(!0),z.current)clearTimeout(z.current);z.current=setTimeout(()=>{if(j.current)T(!1)},3000)},[]);return l`
        <div class="settings-section">
            ${F&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Workspace settings applied. Server-side limits affect new workspace requests immediately.
                </div>
            `}
            ${K&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Browser workspace settings applied immediately in this tab.
                </div>
            `}

            <h3>Access</h3>
            <div class="settings-row">
                <label>Enable web terminal</label>
                <input type="checkbox" checked=${c} onChange=${(B)=>_(B.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Allow direct VNC targets</label>
                <input type="checkbox" checked=${u} onChange=${(B)=>f(B.target.checked)} />
            </div>
            <p class="settings-hint">Terminal access updates immediately. Direct VNC target policy applies to new VNC requests.</p>

            <h3 style="margin-top:20px">Server scan guardrails</h3>
            <div class="settings-row">
                <label>Max tree depth</label>
                <${d}
                    label="workspace tree max depth"
                    value=${o}
                    min=${1}
                    max=${8}
                    fallback=${4}
                    width="80px"
                    onChange=${s}
                />
                <span class="settings-hint" style="margin:0">caps all <code>/workspace/tree</code> requests</span>
            </div>
            <div class="settings-row">
                <label>Max entries per scan</label>
                <${d}
                    label="workspace tree max entries"
                    value=${g}
                    min=${250}
                    max=${5000}
                    step=${250}
                    fallback=${5000}
                    width="92px"
                    onChange=${v}
                />
                <span class="settings-hint" style="margin:0">truncate oversized tree walks earlier</span>
            </div>

            <h3 style="margin-top:20px">This browser</h3>
            <div class="settings-row">
                <label>Refresh interval (seconds)</label>
                <${d}
                    label="workspace refresh interval"
                    value=${t}
                    min=${15}
                    max=${300}
                    step=${15}
                    fallback=${60}
                    width="92px"
                    onChange=${(B)=>G({refreshIntervalSec:B})}
                />
            </div>
            <div class="settings-row">
                <label>Folder preview scan depth</label>
                <${d}
                    label="folder preview scan depth"
                    value=${h}
                    min=${0}
                    max=${8}
                    fallback=${3}
                    width="80px"
                    onChange=${(B)=>G({folderPreviewDepth:B})}
                />
                <span class="settings-hint" style="margin:0">set to <code>0</code> to disable folder size preview scans</span>
            </div>
            <p class="settings-hint">Root and folder-expansion tree loads remain shallow; the folder size preview is the deepest workspace scan in the UI.</p>
        </div>
    `}var F_=Z(()=>{m();bn();b_();Vn()});var k_={};cn(k_,{EnvironmentSection:()=>Tl});function Pi(n={}){let r=n.environmentSettings||n.settings||n.environment||{};return{variables:Array.isArray(r.variables)?r.variables:[],overrides:r.overrides&&typeof r.overrides==="object"?r.overrides:{},count:Number(r.count||0),overrideCount:Number(r.overrideCount||0),keychainEnvNames:Array.isArray(r.keychainEnvNames)?r.keychainEnvNames:[]}}function Tl({settingsData:n,filter:r="",setStatus:i,mergeSettingsData:c}){let[_,u]=$(()=>Pi(n||{})),[f,o]=$({}),[s,g]=$(""),[v,t]=$(""),[b,h]=$(null);M(()=>{u(Pi(n||{})),o({})},[n]);let x=R((k)=>{let U=Pi({environmentSettings:k?.settings||k});return u(U),c?.({environmentSettings:U}),o({}),U},[c]),F=R(async()=>{try{let k=await zi();if(k?.ok)x(k.settings);i?.("Environment refreshed.","info")}catch(k){i?.(String(k?.message||k),"error")}},[x,i]),y=R(async(k,U)=>{let z=String(k||"").trim();if(!z)return;h(z);try{let j=await Rr({action:"set",name:z,value:String(U??"")});if(j?.ok)x(j.settings);if(i?.(`Saved environment override for ${z}.`,"info"),z===s.trim())g(""),t("")}catch(j){i?.(String(j?.message||j),"error")}finally{h(null)}},[x,s,i]),K=R(async(k)=>{let U=String(k||"").trim();if(!U)return;h(U);try{let z=await Rr({action:"clear",name:U});if(z?.ok)x(z.settings);i?.(`Cleared environment override for ${U}.`,"info")}catch(z){i?.(String(z?.message||z),"error")}finally{h(null)}},[x,i]),T=I(()=>{let k=String(r||"").trim().toLowerCase(),U=Array.isArray(_.variables)?_.variables:[];if(!k)return U;return U.filter((z)=>{return`${z?.name||""} ${z?.value||""} ${z?.source||""}`.toLowerCase().includes(k)})},[_.variables,r]),L=R((k,U)=>{o((z)=>({...z||{},[k]:U}))},[]);return l`
        <div class="settings-section">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:12px;">
                <div>
                    <h3 style="margin-top:0">Environment</h3>
                    <p class="settings-hint" style="margin-top:4px">
                        Showing non-keychain environment variables only. Overrides are stored in extension KV and applied to <code>process.env</code>, so subsequent tool calls inherit them.
                    </p>
                </div>
                <button type="button" class="settings-secondary-btn" onClick=${F}>Refresh</button>
            </div>

            <div class="settings-row" style="align-items:flex-start; gap:10px;">
                <label>Add override</label>
                <div style="display:grid; grid-template-columns:minmax(180px, 0.7fr) minmax(240px, 1fr) auto; gap:8px; flex:1;">
                    <input
                        type="text"
                        value=${s}
                        placeholder="VARIABLE_NAME"
                        spellcheck="false"
                        onInput=${(k)=>g(k.target.value)}
                    />
                    <input
                        type="text"
                        value=${v}
                        placeholder="value"
                        spellcheck="false"
                        onInput=${(k)=>t(k.target.value)}
                    />
                    <button
                        type="button"
                        disabled=${!s.trim()||b===s.trim()}
                        onClick=${()=>y(s,v)}
                    >Save</button>
                </div>
            </div>

            <p class="settings-hint">
                ${_.count} variables visible • ${_.overrideCount} overrides active • ${_.keychainEnvNames.length} keychain-injected variables hidden
            </p>

            <div class="settings-tool-list" style="max-height:58vh; overflow:auto;">
                ${T.map((k)=>{let U=String(k?.name||""),z=Object.prototype.hasOwnProperty.call(f,U)?f[U]:k.value,j=z!==k.value,X=b===U;return l`
                        <div class="settings-tool-row" key=${U} style="grid-template-columns:minmax(180px,0.45fr) minmax(240px,1fr) auto auto; align-items:center;">
                            <span class="settings-tool-name" title=${U}>${U}</span>
                            <input
                                type="text"
                                value=${z}
                                spellcheck="false"
                                onInput=${(w)=>L(U,w.target.value)}
                                style="min-width:0; width:100%; font-family:var(--font-mono, monospace);"
                            />
                            <span class="settings-tool-kind" title=${k.overridden?"Overridden in KV":"Inherited from process environment"}>
                                ${k.overridden?"override":"process"}
                            </span>
                            <span style="display:flex; gap:6px; justify-content:flex-end;">
                                <button type="button" disabled=${X||!j} onClick=${()=>y(U,z)}>Save</button>
                                <button type="button" disabled=${X||!k.overridden} onClick=${()=>K(U)}>Clear</button>
                            </span>
                        </div>
                    `})}
                ${T.length===0&&l`<p class="settings-hint">No environment variables match "${r}".</p>`}
            </div>
        </div>
    `}var B_=Z(()=>{m();bn()});var T_={};cn(T_,{ProvidersSection:()=>Wl});function jl(n){switch(n){case"oauth":return"OAuth";case"api_key":return"API key";case"custom":return"Configured";default:return"Configured"}}function Wl({providers:n,setStatus:r}){let[i,c]=$(null),[_,u]=$(null),[f,o]=$({}),s=R((y,K)=>{o((T)=>({...T,[y]:K}))},[]),g=R(async(y)=>{let K=(f.apiKey||"").trim();if(!K){r?.("API key cannot be empty.","error");return}c(y),r?.(`Configuring ${y}…`,"info");try{let T=JSON.stringify({provider:y,method:"api_key",api_key:K}),L=await vn("default",`/login __step2 ${T}`,null,[]);if(L?.command?.status==="error"){r?.(L.command.message,"error");return}r?.(L?.command?.message||`${y} configured.`,"success"),u(null),o({})}catch(T){r?.(String(T.message||T),"error")}finally{c(null)}},[f,r]),v=R(async(y,K)=>{c(y),r?.(`Configuring ${y}…`,"info");try{let T={provider:y,method:"custom"};for(let U of K.customFields||[])T[U.key]=(f[U.key]||"").trim();let L=JSON.stringify(T),k=await vn("default",`/login __step2 ${L}`,null,[]);if(k?.command?.status==="error"){r?.(k.command.message,"error");return}r?.(k?.command?.message||`${y} configured.`,"success"),u(null),o({})}catch(T){r?.(String(T.message||T),"error")}finally{c(null)}},[f,r]),t=R(async(y)=>{c(y),r?.(`Starting OAuth for ${y}…`,"info");try{let K=JSON.stringify({provider:y}),L=(await vn("default",`/login __step1 ${K}`,null,[]))?.command?.message||"";if(L.includes("http")){let k=L.match(/(https?:\/\/[^\s)]+)/);if(k)window.open(k[1],"_blank","noopener"),r?.("OAuth window opened. Complete the sign-in flow, then close this message.","success");else r?.(L,"success")}else r?.(L||`OAuth flow started for ${y}. Check the chat.`,"success")}catch(K){r?.(String(K.message||K),"error")}finally{c(null)}},[r]),b=R(async(y)=>{if(i)return;c(y),r?.(`Logging out ${y}…`,"info");try{await vn("default",`/logout ${y}`,null,[]),r?.(`Logged out ${y}. Restart may be needed.`,"success")}catch(K){r?.(String(K.message||K),"error")}finally{c(null)}},[i,r]),h=n||[],x=(y)=>_===y,F=(y)=>{u((K)=>K===y?null:y),o({})};return l`
        <div class="settings-section">
            <h3>Providers</h3>
            <div class="settings-provider-list">
                ${h.map((y)=>l`
                    <div class=${`settings-provider-card${y.configured?" configured":""}`}>
                        <div class="settings-provider-card-header" onClick=${()=>!y.configured&&F(y.id)}>
                            <div class="settings-provider-card-title">
                                <strong>${y.name}</strong>
                                <span class="settings-provider-id">${y.id}</span>
                                ${y.configured&&l`<span class="settings-tag settings-tag-skill">${jl(y.authType)}</span>`}
                            </div>
                            <div class="settings-provider-card-meta">
                                ${y.hasOAuth&&l`<span class="settings-tag">OAuth</span>`}
                                ${y.hasApiKey&&l`<span class="settings-tag">API Key</span>`}
                                ${y.isCustom&&l`<span class="settings-tag">Custom</span>`}
                            </div>
                            <div class="settings-provider-card-actions">
                                ${y.configured?l`
                                    <button class="settings-addon-btn settings-addon-btn-remove"
                                        disabled=${i===y.id} onClick=${(K)=>{K.stopPropagation(),b(y.id)}}
                                    >${i===y.id?"…":"Logout"}</button>
                                    <button class="settings-addon-btn"
                                        disabled=${i===y.id} onClick=${(K)=>{K.stopPropagation(),F(y.id)}}
                                    >Reconfigure</button>
                                `:l`
                                    <button class="settings-addon-btn settings-addon-btn-install"
                                        disabled=${i===y.id} onClick=${(K)=>{K.stopPropagation(),F(y.id)}}
                                    >Set up</button>
                                `}
                            </div>
                        </div>

                        ${x(y.id)&&l`
                            <div class="settings-provider-setup">
                                <p class="settings-hint settings-provider-setup-hint">Sign-in flows open in the browser. In narrow panes the setup form stacks vertically to avoid clipping.</p>
                                ${y.hasOAuth&&l`
                                    <div class="settings-provider-method">
                                        <button class="settings-addon-btn settings-addon-btn-install"
                                            disabled=${i===y.id}
                                            onClick=${()=>t(y.id)}>
                                            ${i===y.id?"Starting…":"Sign in with OAuth"}
                                        </button>
                                    </div>
                                `}
                                ${y.hasApiKey&&l`
                                    <div class="settings-provider-method">
                                        <div class="settings-provider-field-row">
                                            <label>API Key</label>
                                            <input type="password" value=${f.apiKey||""}
                                                onInput=${(K)=>s("apiKey",K.target.value)}
                                                placeholder=${y.apiKeyHint||"Enter API key"} />
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${i===y.id||!(f.apiKey||"").trim()}
                                                onClick=${()=>g(y.id)}>
                                                ${i===y.id?"…":"Save"}
                                            </button>
                                        </div>
                                    </div>
                                `}
                                ${y.isCustom&&l`
                                    <div class="settings-provider-method">
                                        ${(y.customFields||[]).map((K)=>l`
                                            <div class="settings-provider-field-row">
                                                <label>${K.label}${K.required?" *":""}</label>
                                                <input type="text" value=${f[K.key]||""}
                                                    onInput=${(T)=>s(K.key,T.target.value)}
                                                    placeholder=${K.placeholder||""} />
                                            </div>
                                        `)}
                                        <div class="settings-provider-form-actions">
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${i===y.id}
                                                onClick=${()=>v(y.id,y)}>
                                                ${i===y.id?"Configuring…":"Save configuration"}
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
    `}var j_=Z(()=>{m();bn()});var W_={};cn(W_,{ModelsSection:()=>Ll});function Gl(n){return typeof n==="string"&&n.toLowerCase()==="anthropic"}function Hl({thinkingLevel:n,supportsThinking:r,provider:i,availableLevels:c,onSetLevel:_,disabled:u}){let f=Gl(i)?Rl:Ul,o=c&&c.length>1?c:["off","minimal","low","medium","high"],s=Math.max(0,o.indexOf(n??"off"));if(!r)return l`<div class="settings-thinking-slider"><label>Thinking level</label><p class="settings-hint" style="margin:4px 0 0">Current model does not support thinking.</p></div>`;return l`
        <div class="settings-thinking-slider">
            <label>Thinking level: <strong>${f[o[s]]||o[s]}</strong></label>
            <div class="settings-slider-track">
                <input type="range" min="0" max=${o.length-1} step="1" value=${s} disabled=${u}
                    onInput=${(g)=>_(o[parseInt(g.target.value,10)])} />
                <div class="settings-slider-labels">
                    ${o.map((g,v)=>l`<span class=${v===s?"active":""} onClick=${()=>!u&&_(g)}>${f[g]||g}</span>`)}
                </div>
            </div>
        </div>
    `}function Ll({filter:n=""}){let[r,i]=$(null),[c,_]=$(!1),[u,f]=$("off"),[o,s]=$(!1),[g,v]=$(["off"]),[t,b]=$(!1),[h,x]=$(!1),[F,y]=$(!1),K=R(async()=>{let B=await Fi();if(i(B),B.thinking_level)f(B.thinking_level);if(s(Boolean(B.supports_thinking)),b(Boolean(B.scoped_models_only)),Array.isArray(B.available_thinking_levels)&&B.available_thinking_levels.length>0)v(B.available_thinking_levels);return B},[]);M(()=>{K().catch((B)=>{console.warn("[settings/models] Failed to load models.",B),i({models:[],model_options:[]})})},[]);let T=R(async(B)=>{if(c)return;_(!0);try{await vn("default",`/model ${B}`,null,[]),await K()}catch(p){console.error("Failed to switch model:",p)}finally{_(!1)}},[c,K]),L=R(async(B)=>{if(h)return;x(!0),b(Boolean(B));try{let p=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scopedModelsOnly:Boolean(B)})}),H=await p.json().catch(()=>({}));if(!p.ok||!H?.ok)throw Error(H?.error||"Failed to save scoped model setting.");await K()}catch(p){console.error("Failed to set scoped model filtering:",p),await K().catch((H)=>{console.warn("[settings/models] Reload after scoped model filtering failure failed.",H)})}finally{x(!1)}},[h,K]),k=R(async(B)=>{if(F)return;y(!0),f(B);try{let p=await vn("default",`/thinking ${B}`,null,[]);if(p?.command?.thinking_level)f(p.command.thinking_level);s(p?.command?.supports_thinking!==!1),await K()}catch(p){console.error("Failed to set thinking:",p),await K().catch((H)=>{console.warn("[settings/models] Reload after thinking change failure failed.",H)})}finally{y(!1)}},[F,K]);if(!r)return l`<div class="settings-loading">Loading models\u2026</div>`;let U=r.model_options||[],z=r.current,X=U.find((B)=>B.label===z)?.provider||"",w=n.toLowerCase(),G=w?U.filter((B)=>B.label.toLowerCase().includes(w)||(B.provider||"").toLowerCase().includes(w)):U;return l`
        <div class="settings-models-split">
            <div class="settings-models-summary settings-hint">Model and provider names may wrap in narrow panes to avoid clipping.</div>
            <div class="settings-row" style="padding:0 0 10px 0; align-items:flex-start">
                <label>Scoped models only</label>
                <div style="display:flex; flex-direction:column; gap:4px; min-width:0">
                    <label style="display:flex; align-items:center; gap:8px; font-weight:500">
                        <input type="checkbox" checked=${t} disabled=${h} onChange=${(B)=>L(B.target.checked)} />
                        Use Pi <code>enabledModels</code> for Piclaw model lists
                    </label>
                    <span class="settings-hint" style="margin:0">
                        Filters this picker and the <code>list_models</code> tool. TUI model selection remains unchanged.
                    </span>
                </div>
            </div>
            <div class="settings-models-list">
                <table class="settings-table settings-borderless settings-models-table">
                    <thead><tr><th style="width:32px"></th><th>Model</th><th>Provider</th><th>Context</th><th style="text-align:center">Reasoning</th></tr></thead>
                    <tbody>
                        ${G.map((B)=>l`
                            <tr class=${B.label===z?"settings-row-active":""}>
                                <td><input type="radio" name="settings-model" checked=${B.label===z} disabled=${c} onChange=${()=>T(B.label)} /></td>
                                <td>${B.name||B.label}</td><td>${B.provider}</td>
                                <td>${B.context_window?(B.context_window/1000).toFixed(0)+"K":"—"}</td>
                                <td style="text-align:center">${B.reasoning?"\uD83E\uDDE0":"—"}</td>
                            </tr>
                        `)}
                        ${G.length===0&&l`<tr><td colspan="5" class="settings-empty">No models match "${n}"</td></tr>`}
                    </tbody>
                </table>
            </div>
            <div class="settings-models-footer">
                <${Hl}
                    thinkingLevel=${u}
                    supportsThinking=${o}
                    provider=${X}
                    availableLevels=${g}
                    onSetLevel=${k}
                    disabled=${F||c} />
            </div>
        </div>
    `}var Rl,Ul;var R_=Z(()=>{m();bn();Rl={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"max"},Ul={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"xhigh"}});function Ai(n){let r=String(n||"").trim().toLowerCase();if(!r)return"default";if(r==="solarized-dark"||r==="solarized-light")return"solarized";if(r==="github-dark"||r==="github-light")return"github";if(r==="tokyo-night")return"tokyo";return r}function L_(n){if(!n)return null;let r=String(n).trim();if(!r)return null;let i=r.startsWith("#")?r.slice(1):r;if(!/^[0-9a-fA-F]{3}$/.test(i)&&!/^[0-9a-fA-F]{6}$/.test(i))return null;let c=i.length===3?i.split("").map((u)=>u+u).join(""):i,_=parseInt(c,16);return{r:_>>16&255,g:_>>8&255,b:_&255,hex:`#${c.toLowerCase()}`}}function Vl(n,r){try{if(document.body){n.style.display="none",document.body.appendChild(n);let i=getComputedStyle(n).color||n.style.color;return document.body.removeChild(n),i}}catch{return r}return r}function Pl(n){if(!n||typeof document>"u")return null;let r=String(n).trim();if(!r)return null;let i=document.createElement("div");if(i.style.color="",i.style.color=r,!i.style.color)return null;let _=Vl(i,i.style.color).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!_)return null;let u=parseInt(_[1],10),f=parseInt(_[2],10),o=parseInt(_[3],10);if(![u,f,o].every((g)=>Number.isFinite(g)))return null;let s=`#${[u,f,o].map((g)=>g.toString(16).padStart(2,"0")).join("")}`;return{r:u,g:f,b:o,hex:s}}function Pn(n){return L_(n)||Pl(n)}function Qi(n,r,i){let c=Math.round(n.r+(r.r-n.r)*i),_=Math.round(n.g+(r.g-n.g)*i),u=Math.round(n.b+(r.b-n.b)*i);return`rgb(${c} ${_} ${u})`}function Vr(n,r){return`rgba(${n.r}, ${n.g}, ${n.b}, ${r})`}function Ml(n){let r=n.r/255,i=n.g/255,c=n.b/255,_=r<=0.03928?r/12.92:Math.pow((r+0.055)/1.055,2.4),u=i<=0.03928?i/12.92:Math.pow((i+0.055)/1.055,2.4),f=c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);return 0.2126*_+0.7152*u+0.0722*f}function Xl(n){return Ml(n)>0.4?"#000000":"#ffffff"}function N_(){if(typeof window>"u")return"light";try{return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch{return"light"}}function qi(n){return U_[n]||U_.default}function Al(n){return n.mode==="auto"?N_():n.mode}function V_(n,r){let i=qi(n);if(r==="dark"&&i.dark)return i.dark;if(r==="light"&&i.light)return i.light;return i.dark||i.light||Fn}function zn(n,r,i){let c=Pn(n);if(!c)return n;return Qi(c,r,i)}function P_(n,r,i){let c=Pn(r);if(!c)return n;let u=L_(i==="dark"?"#ffffff":"#000000");return{...n,bgPrimary:zn(n.bgPrimary,c,0.08),bgSecondary:zn(n.bgSecondary,c,0.12),bgHover:zn(n.bgHover,c,0.16),textPrimary:zn(n.textPrimary,c,i==="dark"?0.08:0.06),textSecondary:zn(n.textSecondary,c,i==="dark"?0.12:0.1),borderColor:zn(n.borderColor,c,0.1),accent:c.hex,accentHover:u?Qi(c,u,0.18):c.hex,warning:zn(n.warning||Fn.warning,c,0.14),danger:zn(n.danger,c,0.16),success:zn(n.success,c,0.16)}}function Ql(n,r){let i=Pn(n?.warning);if(i)return i.hex;let c=Pn(r==="dark"?Xr.warning:Fn.warning)||Pn(Fn.warning),_=Pn(n?.accent);if(c&&_)return Qi(c,_,r==="dark"?0.18:0.14);return r==="dark"?Xr.warning:Fn.warning}function ql(n,r){if(typeof document>"u")return;let i=document.documentElement,c=n.accent,_=Pn(c),u=_?Vr(_,r==="dark"?0.35:0.2):n.searchHighlight||n.searchHighlightColor,f=_?Vr(_,r==="dark"?0.16:0.12):"rgba(29, 155, 240, 0.12)",o=_?Vr(_,r==="dark"?0.28:0.2):"rgba(29, 155, 240, 0.2)",s=_?Xl(_):r==="dark"?"#000000":"#ffffff",g=_?Vr(_,r==="dark"?0.35:0.25):"rgba(29, 155, 240, 0.25)",v=Ql(n,r),t={"--bg-primary":n.bgPrimary,"--bg-secondary":n.bgSecondary,"--bg-hover":n.bgHover,"--text-primary":n.textPrimary,"--text-secondary":n.textSecondary,"--border-color":n.borderColor,"--accent-color":c,"--accent-hover":n.accentHover||c,"--accent-color-alpha":g,"--accent-soft":f,"--accent-soft-strong":o,"--accent-contrast-text":s,"--warning-color":v,"--danger-color":n.danger||Fn.danger,"--success-color":n.success||Fn.success,"--search-highlight-color":u||"rgba(29, 155, 240, 0.2)"};Object.entries(t).forEach(([b,h])=>{if(h)i.style.setProperty(b,h)})}function Il(){if(typeof document>"u")return;let n=document.documentElement;Nl.forEach((r)=>n.style.removeProperty(r))}function en(n,r={}){if(typeof document>"u")return null;let i=typeof r.id==="string"&&r.id.trim()?r.id.trim():null,c=i?document.getElementById(i):document.querySelector(`meta[name="${n}"]`);if(!c)c=document.createElement("meta"),document.head.appendChild(c);if(c.setAttribute("name",n),i)c.setAttribute("id",i);return c}function G_(n){let r=Ai(Mn?.theme||"default"),i=Mn?.tint?String(Mn.tint).trim():null,c=V_(r,n);if(r==="default"&&i)c=P_(c,i,n);if(c?.bgPrimary)return c.bgPrimary;return n==="dark"?Xr.bgPrimary:Fn.bgPrimary}function Dl(n,r){if(typeof document>"u")return;let i=en("theme-color",{id:"dynamic-theme-color"});if(i&&n)i.removeAttribute("media"),i.setAttribute("content",n);let c=en("theme-color",{id:"theme-color-light"});if(c)c.setAttribute("media","(prefers-color-scheme: light)"),c.setAttribute("content",G_("light"));let _=en("theme-color",{id:"theme-color-dark"});if(_)_.setAttribute("media","(prefers-color-scheme: dark)"),_.setAttribute("content",G_("dark"));let u=en("msapplication-TileColor");if(u&&n)u.setAttribute("content",n);let f=en("msapplication-navbutton-color");if(f&&n)f.setAttribute("content",n);let o=en("apple-mobile-web-app-status-bar-style");if(o)o.setAttribute("content",r==="dark"?"black-translucent":"default")}function Zl(){if(typeof window>"u")return;let n={...Mn,mode:H_};window.dispatchEvent(new CustomEvent("piclaw-theme-change",{detail:n}))}function Yl(){if(typeof window>"u")return"web:default";try{let r=new URL(window.location.href).searchParams.get("chat_jid");return r&&r.trim()?r.trim():"web:default"}catch{return"web:default"}}function Cl(n){if(typeof document>"u"||!n)return;let r=document.documentElement;if(r?.style)r.style.background=n;if(document.body?.style)document.body.style.background=n}function Ii(n,r={}){if(typeof window>"u"||typeof document>"u")return;let i=Ai(n?.theme||"default"),c=n?.tint?String(n.tint).trim():null,_=qi(i),u=Al(_),f=V_(i,u);Mn={theme:i,tint:c},H_=u;let o=document.documentElement;o.dataset.theme=u,o.dataset.colorTheme=i,o.dataset.tint=c?String(c):"",o.style.colorScheme=u;let s=f;if(i==="default"&&c)s=P_(f,c,u);if(i==="default"&&!c)Il();else ql(s,u);if(Cl(s.bgPrimary),Dl(s.bgPrimary,u),Zl(),r.persist!==!1)if(ln(Xi,i),c)ln(Mr,c);else ln(Mr,"")}function Pr(){if(qi(Mn.theme).mode!=="auto")return;Ii(Mn,{persist:!1})}function Ol(){if(typeof window>"u")return;let n=Ai(Cn(Xi)||"default"),r=(()=>{let i=Cn(Mr);return i?i.trim():null})();Ii({theme:n,tint:r},{persist:!1})}function _s(){if(typeof window>"u")return()=>{};if(Ol(),window.matchMedia&&!Mi){let n=window.matchMedia("(prefers-color-scheme: dark)");if(n.addEventListener)n.addEventListener("change",Pr);else if(n.addListener)n.addListener(Pr);return Mi=!0,()=>{if(n.removeEventListener)n.removeEventListener("change",Pr);else if(n.removeListener)n.removeListener(Pr);Mi=!1}}return()=>{}}function Di(n){if(!n||typeof n!=="object")return;let r=Yl(),i=n.chat_jid||n.chatJid||null,c=n.theme??n.name??n.colorTheme,_=n.tint??null;if(!i||i===r)Ii({theme:c||"default",tint:_},{persist:!1});ln(Xi,c||"default"),ln(Mr,_||"")}function us(){if(typeof document>"u")return"light";let n=document.documentElement?.dataset?.theme;if(n==="dark"||n==="light")return n;return N_()}var Xi="piclaw_theme",Mr="piclaw_tint",Fn,Xr,U_,Nl,Mn,H_="light",Mi=!1;var M_=Z(()=>{Fn={bgPrimary:"#ffffff",bgSecondary:"#f7f9fa",bgHover:"#e8ebed",textPrimary:"#0f1419",textSecondary:"#536471",borderColor:"#eff3f4",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},Xr={bgPrimary:"#000000",bgSecondary:"#16181c",bgHover:"#1d1f23",textPrimary:"#e7e9ea",textSecondary:"#71767b",borderColor:"#2f3336",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},U_={default:{label:"Default",mode:"auto",light:Fn,dark:Xr},tango:{label:"Tango",mode:"light",light:{bgPrimary:"#f6f5f4",bgSecondary:"#efedeb",bgHover:"#e5e3e1",textPrimary:"#2e3436",textSecondary:"#5c6466",borderColor:"#d3d7cf",accent:"#3465a4",accentHover:"#2c5890",danger:"#cc0000",success:"#4e9a06"}},xterm:{label:"XTerm",mode:"dark",dark:{bgPrimary:"#000000",bgSecondary:"#0a0a0a",bgHover:"#121212",textPrimary:"#d0d0d0",textSecondary:"#8a8a8a",borderColor:"#1f1f1f",accent:"#00a2ff",accentHover:"#0086d1",danger:"#ff5f5f",success:"#5fff87"}},monokai:{label:"Monokai",mode:"dark",dark:{bgPrimary:"#272822",bgSecondary:"#2f2f2f",bgHover:"#3a3a3a",textPrimary:"#f8f8f2",textSecondary:"#cfcfc2",borderColor:"#3e3d32",accent:"#f92672",accentHover:"#e81560",danger:"#f92672",success:"#a6e22e"}},"monokai-pro":{label:"Monokai Pro",mode:"dark",dark:{bgPrimary:"#2d2a2e",bgSecondary:"#363237",bgHover:"#403a40",textPrimary:"#fcfcfa",textSecondary:"#c1c0c0",borderColor:"#444046",accent:"#ff6188",accentHover:"#f74f7e",danger:"#ff4f5e",success:"#a9dc76"}},ristretto:{label:"Ristretto",mode:"dark",dark:{bgPrimary:"#2c2525",bgSecondary:"#362d2d",bgHover:"#403535",textPrimary:"#f4f1ef",textSecondary:"#cbbdb8",borderColor:"#4a3c3c",accent:"#ff9f43",accentHover:"#f28a2e",danger:"#ff5f56",success:"#a9dc76"}},dracula:{label:"Dracula",mode:"dark",dark:{bgPrimary:"#282a36",bgSecondary:"#303445",bgHover:"#3a3f52",textPrimary:"#f8f8f2",textSecondary:"#c5c8d6",borderColor:"#44475a",accent:"#bd93f9",accentHover:"#a87ded",danger:"#ff5555",success:"#50fa7b"}},catppuccin:{label:"Catppuccin",mode:"dark",dark:{bgPrimary:"#1e1e2e",bgSecondary:"#24273a",bgHover:"#2c2f41",textPrimary:"#cdd6f4",textSecondary:"#a6adc8",borderColor:"#313244",accent:"#89b4fa",accentHover:"#74a0f5",danger:"#f38ba8",success:"#a6e3a1"}},nord:{label:"Nord",mode:"dark",dark:{bgPrimary:"#2e3440",bgSecondary:"#3b4252",bgHover:"#434c5e",textPrimary:"#eceff4",textSecondary:"#d8dee9",borderColor:"#4c566a",accent:"#88c0d0",accentHover:"#78a9c0",danger:"#bf616a",success:"#a3be8c"}},gruvbox:{label:"Gruvbox",mode:"dark",dark:{bgPrimary:"#282828",bgSecondary:"#32302f",bgHover:"#3c3836",textPrimary:"#ebdbb2",textSecondary:"#bdae93",borderColor:"#3c3836",accent:"#d79921",accentHover:"#c28515",danger:"#fb4934",success:"#b8bb26"}},solarized:{label:"Solarized",mode:"auto",light:{bgPrimary:"#fdf6e3",bgSecondary:"#f5efdc",bgHover:"#eee8d5",textPrimary:"#586e75",textSecondary:"#657b83",borderColor:"#e0d8c6",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"},dark:{bgPrimary:"#002b36",bgSecondary:"#073642",bgHover:"#0b3c4a",textPrimary:"#eee8d5",textSecondary:"#93a1a1",borderColor:"#18424a",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"}},tokyo:{label:"Tokyo",mode:"dark",dark:{bgPrimary:"#1a1b26",bgSecondary:"#24283b",bgHover:"#2f3549",textPrimary:"#c0caf5",textSecondary:"#9aa5ce",borderColor:"#414868",accent:"#7aa2f7",accentHover:"#6b92e6",danger:"#f7768e",success:"#9ece6a"}},miasma:{label:"Miasma",mode:"dark",dark:{bgPrimary:"#1f1f23",bgSecondary:"#29292f",bgHover:"#33333a",textPrimary:"#e5e5e5",textSecondary:"#b4b4b4",borderColor:"#3d3d45",accent:"#c9739c",accentHover:"#b8618c",danger:"#e06c75",success:"#98c379"}},github:{label:"GitHub",mode:"auto",light:{bgPrimary:"#ffffff",bgSecondary:"#f6f8fa",bgHover:"#eaeef2",textPrimary:"#24292f",textSecondary:"#57606a",borderColor:"#d0d7de",accent:"#0969da",accentHover:"#0550ae",danger:"#cf222e",success:"#1a7f37"},dark:{bgPrimary:"#0d1117",bgSecondary:"#161b22",bgHover:"#21262d",textPrimary:"#c9d1d9",textSecondary:"#8b949e",borderColor:"#30363d",accent:"#2f81f7",accentHover:"#1f6feb",danger:"#f85149",success:"#3fb950"}},gotham:{label:"Gotham",mode:"dark",dark:{bgPrimary:"#0b0f14",bgSecondary:"#111720",bgHover:"#18212b",textPrimary:"#cbd6e2",textSecondary:"#9bb0c3",borderColor:"#1f2a37",accent:"#5ccfe6",accentHover:"#48b8ce",danger:"#d26937",success:"#2aa889"}}},Nl=["--bg-primary","--bg-secondary","--bg-hover","--text-primary","--text-secondary","--border-color","--accent-color","--accent-hover","--accent-color-alpha","--accent-contrast-text","--accent-soft","--accent-soft-strong","--warning-color","--danger-color","--success-color","--search-highlight-color"],Mn={theme:"default",tint:null}});var A_={};cn(A_,{ThemeSection:()=>el});function X_(n={}){return{uiTheme:typeof n.uiTheme==="string"&&n.uiTheme.trim()?n.uiTheme.trim():"default",uiTint:typeof n.uiTint==="string"&&n.uiTint.trim()?n.uiTint.trim():""}}function el({themes:n,colorKeys:r,settingsData:i,setStatus:c,mergeSettingsData:_}){let[u,f]=$("default"),[o,s]=$(""),[g,v]=$(!1),t=D(""),b=D(null),h=D(!0);M(()=>{return h.current=!0,()=>{h.current=!1}},[]);let x=R((L)=>{let k=X_(L);f(k.uiTheme),s(k.uiTint),t.current=JSON.stringify(k)},[]);M(()=>{if(i){x(i);return}x({uiTheme:document.documentElement.dataset.colorTheme||"default",uiTint:document.documentElement.dataset.tint||""})},[i,x]);let F=R((L,k)=>{Di({theme:L,tint:k||null}),f(L||"default"),s(k||"")},[]),y=I(()=>JSON.stringify(X_({uiTheme:u,uiTint:o})),[u,o]);M(()=>{if(y===t.current)return;if(b.current)clearTimeout(b.current);return b.current=setTimeout(async()=>{if(!h.current)return;v(!0);try{let L=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:y}),k=await L.json().catch(()=>({}));if(!h.current)return;if(!L.ok||!k?.ok||!k?.settings){c?.(k?.error||"Failed to save appearance settings.","error");return}t.current=y,_?.(k.settings),c?.("Appearance synced across clients.","success")}catch(L){if(!h.current)return;console.warn("[settings/appearance] Failed to persist appearance settings.",L),c?.("Failed to save appearance settings.","error")}finally{if(h.current)v(!1)}},250),()=>{if(b.current)clearTimeout(b.current)}},[y,_,c]);let K=r||[],T=n||[];return l`
        <div class="settings-section">
            ${g&&l`<div class="settings-hint" style="margin:0 0 12px 0;">Syncing appearance…</div>`}
            <div class="settings-tint-row">
                <label class="settings-tint-label">
                    <input type="radio" name="settings-theme"
                        checked=${u==="default"}
                        onChange=${()=>F("default",o)} />
                    <strong>Default</strong>
                    <span class="settings-hint" style="margin:0 0 0 6px">auto (light/dark)</span>
                </label>
                <div class="settings-tint-picker">
                    <label class="settings-hint" style="margin:0">Tint:</label>
                    <input type="color"
                        value=${o||"#1d9bf0"}
                        onInput=${(L)=>{let k=L.target.value;if(s(k),u==="default")Di({theme:"default",tint:k})}} />
                    ${o&&l`
                        <button class="settings-tint-clear" onClick=${()=>F("default","")}
                            title="Clear tint">\u2715</button>
                    `}
                    <span class="settings-tint-hex">${o||"none"}</span>
                </div>
            </div>

            <table class="settings-table settings-borderless settings-theme-table">
                <thead>
                    <tr>
                        <th></th><th>Theme</th><th>Mode</th>
                        ${K.map((L)=>l`<th class="settings-swatch-header">${L.replace(/([A-Z])/g," $1").trim()}</th>`)}
                    </tr>
                </thead>
                <tbody>
                    ${T.filter((L)=>L.name!=="default").map((L)=>l`
                        <tr class=${L.name===u?"settings-row-active":""}
                            style="cursor:pointer" onClick=${()=>F(L.name,"")}>
                            <td><input type="radio" name="settings-theme" checked=${L.name===u} onChange=${()=>F(L.name,"")} /></td>
                            <td><strong>${L.label}</strong></td>
                            <td>${L.mode}</td>
                            ${K.map((k)=>{let U=L.colors?.[k];return l`<td class="settings-swatch-cell">
                                    ${U?l`<span class="settings-color-swatch" style=${"background:"+U} title=${U}></span>`:"—"}
                                </td>`})}
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `}var Q_=Z(()=>{m();M_()});var I_={};cn(I_,{__scheduledTasksSettingsTest:()=>al,ScheduledTasksSection:()=>ml});function Xn(n){if(!n)return"—";let r=new Date(n);if(Number.isNaN(r.getTime()))return n;return r.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function q_(n){let r=Number(n);if(!Number.isFinite(r))return"—";if(r<1000)return`${Math.round(r)}ms`;return`${(r/1000).toFixed(r<1e4?1:0)}s`}function Zi(n){if(!n)return"—";if(n.schedule_type==="once")return`once · ${Xn(n.schedule_value)}`;if(n.schedule_type==="interval")return`interval · ${n.schedule_value}`;if(n.schedule_type==="cron")return`cron · ${n.schedule_value}`;return`${n.schedule_type||"schedule"} · ${n.schedule_value||"—"}`}function Yi(n){let r=n?.task_kind||"agent";return r==="internal"?"internal/protected":r}function Ci(n){return(n?.task_kind||"agent")==="internal"}function dl(n){if(!n)return"";let r=String(n).replace(/\s+/g," ").trim();return r.length>180?`${r.slice(0,179)}…`:r}function Jn({children:n,type:r="neutral"}){return l`<span class=${`settings-task-pill settings-task-pill-${r}`}>${n}</span>`}function El({task:n}){let r=Array.isArray(n?.recent_run_logs)?n.recent_run_logs:[];if(!r.length)return l`<p class="settings-hint">No run logs recorded yet.</p>`;return l`
        <div class="settings-task-run-list">
            ${r.map((i)=>l`
                <div class=${`settings-task-run-row settings-task-run-${i.status||"unknown"}`}>
                    <div class="settings-task-run-meta">
                        <${Jn} type=${i.status==="error"?"error":"success"}>${i.status||"unknown"}<//>
                        <span>${Xn(i.run_at)}</span>
                        <span>${q_(i.duration_ms)}</span>
                    </div>
                    <div class="settings-task-run-summary">
                        ${i.error_summary||dl(i.error)||i.result_summary||i.result||"No summary"}
                    </div>
                </div>
            `)}
        </div>
    `}function Sl({task:n,onAction:r}){if(!n)return l`<div class="settings-task-detail-empty">Select a task to inspect schedule, status, and run history.</div>`;let i=Ci(n);return l`
        <div class="settings-task-detail">
            <div class="settings-task-detail-header">
                <div>
                    <h4>${n.summary||n.id}</h4>
                    <code>${n.id}</code>
                </div>
                <div class="settings-task-detail-actions">
                    ${n.status==="active"&&l`<button onClick=${()=>r("pause",n)}>Pause</button>`}
                    ${n.status==="paused"&&l`<button onClick=${()=>r("resume",n)}>Resume</button>`}
                    <button class="danger" onClick=${()=>r("delete",n)}>Delete</button>
                </div>
            </div>
            <div class="settings-task-detail-grid">
                <span>Status</span><strong>${n.status||"—"}</strong>
                <span>Kind</span><strong>${Yi(n)}</strong>
                <span>Schedule</span><strong>${Zi(n)}</strong>
                <span>Next run</span><strong>${Xn(n.next_run)}</strong>
                <span>Last run</span><strong>${Xn(n.last_run)}</strong>
                <span>Last result</span><strong>${n.latest_run_log?.status||n.last_result||"—"}</strong>
                <span>Chat</span><code>${n.chat_jid||"—"}</code>
                <span>Model</span><code>${n.model||"default"}</code>
                ${n.cwd&&l`<span>CWD</span><code>${n.cwd}</code>`}
                ${n.timeout_sec&&l`<span>Timeout</span><strong>${n.timeout_sec}s</strong>`}
                ${i&&l`<span>Protection</span><strong>Internal task actions require explicit confirmation.</strong>`}
            </div>
            <div class="settings-task-command-block">
                <strong>${n.task_kind==="shell"?"Command":"Prompt"}</strong>
                <pre>${n.command||n.prompt||n.command_summary||n.prompt_summary||n.summary||"—"}</pre>
            </div>
            <h4>Recent runs</h4>
            <${El} task=${n} />
        </div>
    `}function ml({filter:n="",setStatus:r}){let[i,c]=$([]),[_,u]=$({active:0,paused:0,completed:0}),[f,o]=$("all"),[s,g]=$(""),[v,t]=$(!0),[b,h]=$(null),[x,F]=$(null),[y,K]=$(null),[T,L]=$(!1),k=R(async(w={})=>{t(!0),h(null);try{let G=await oi({status:f,chatJid:s.trim()||void 0,limit:50,includeRunLogs:!0,runLogLimit:5});c(G.tasks||[]),u(G.counts||{active:0,paused:0,completed:0});let B=w.selectedId||x,p=(G.tasks||[]).find((H)=>H.id===B)||(G.tasks||[])[0]||null;F(p?.id||null),K(p)}catch(G){h(G?.message||"Failed to load scheduled tasks.")}finally{t(!1)}},[f,s,x]);M(()=>{k()},[k]);let U=String(n||"").trim().toLowerCase(),z=I(()=>{if(!U)return i;return i.filter((w)=>[w.id,w.chat_jid,w.status,w.task_kind,w.schedule_type,w.schedule_value,w.summary,w.prompt_summary,w.command_summary,w.latest_run_log?.error_summary].some((G)=>String(G||"").toLowerCase().includes(U)))},[i,U]),j=R((w)=>{F(w?.id||null),K(w||null)},[]),X=R(async(w,G)=>{if(!G||T)return;let B=Ci(G),p=G.summary||G.command_summary||G.prompt_summary||G.id,H=w==="delete"?`Delete scheduled task ${G.id}?

${p}`:`${w==="pause"?"Pause":"Resume"} scheduled task ${G.id}?

${p}`;if(!window.confirm(H))return;if(B&&!window.confirm(`Task ${G.id} is internal/protected. Continue with ${w}?`))return;L(!0),r?.(`${w==="delete"?"Deleting":w==="pause"?"Pausing":"Resuming"} ${G.id}…`,"info");try{await si(w,G.id,{allowInternal:B}),r?.(`Scheduled task ${G.id} ${w==="delete"?"deleted":w==="pause"?"paused":"resumed"}.`,"success"),await k({selectedId:w==="delete"?null:G.id})}catch(A){r?.(A?.message||`Failed to ${w} task.`,"error")}finally{L(!1)}},[T,k,r]);return l`
        <div class="settings-section settings-scheduled-tasks-section">
            <div class="settings-task-toolbar">
                <div class="settings-task-counts">
                    <${Jn} type="active">Active ${_.active||0}<//>
                    <${Jn} type="paused">Paused ${_.paused||0}<//>
                    <${Jn} type="completed">Completed ${_.completed||0}<//>
                </div>
                <div class="settings-task-filters">
                    <select value=${f} onChange=${(w)=>o(w.target.value)}>
                        ${Jl.map((w)=>l`<option value=${w}>${w==="all"?"All statuses":w}</option>`)}
                    </select>
                    <input type="text" placeholder="Filter chat JID…" value=${s} onInput=${(w)=>g(w.target.value)} />
                    <button onClick=${()=>k()} disabled=${v}>Refresh</button>
                </div>
            </div>

            ${v&&l`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading scheduled tasks…</span></div>`}
            ${b&&l`<div class="settings-error-state">${b}</div>`}
            ${!v&&!b&&i.length===0&&l`
                <div class="settings-empty-state">
                    <strong>No scheduled tasks found.</strong>
                    <p>Tasks created with reminders, `/i`, or the scheduler tool will appear here.</p>
                </div>
            `}
            ${!v&&!b&&i.length>0&&l`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Scheduled tasks">
                        ${z.map((w)=>l`
                            <button class=${`settings-task-row ${w.id===x?"active":""}`} onClick=${()=>j(w)}>
                                <span class="settings-task-row-main">
                                    <strong>${w.summary||w.id}</strong>
                                    <span>${Zi(w)}</span>
                                </span>
                                <span class="settings-task-row-meta">
                                    <${Jn} type=${w.status||"neutral"}>${w.status}<//>
                                    <${Jn}>${Yi(w)}<//>
                                </span>
                                <span class="settings-task-row-times">Next ${Xn(w.next_run)} · Last ${Xn(w.last_run)}${w.latest_run_log?.status?` · ${w.latest_run_log.status}`:""}</span>
                            </button>
                        `)}
                        ${z.length===0&&l`<p class="settings-hint">No tasks match “${n}”.</p>`}
                    </div>
                    <${Sl} task=${y&&z.some((w)=>w.id===y.id)?y:z[0]} onAction=${X} />
                </div>
            `}
        </div>
    `}var Jl,al;var D_=Z(()=>{m();bn();Jl=["all","active","paused","completed"];al={formatDateTime:Xn,formatDuration:q_,labelForSchedule:Zi,kindLabel:Yi,isProtectedTask:Ci}});function Z_(n){return String(n||"").toLowerCase().replace(/^[@/]+/,"").replace(/\s+/g," ").trim()}function dn(n){return typeof n==="string"&&n.trim().length>0}function Oi(n,...r){let i=Z_(n);if(!i)return!0;let c=r.map((_)=>Z_(_)).filter(Boolean);for(let _ of c)if(_.startsWith(i)||_.includes(i))return!0;return!1}function Y_(n){if(!Array.isArray(n))return null;let r=[],i=new Set;for(let c of n){let _=String(c||"").trim();if(!_)continue;let u=_.toLowerCase();if(i.has(u))continue;i.add(u),r.push(_)}return r}function sr(n){let r=n&&typeof n==="object"?n:{};return{workspaceCommands:Y_(r.workspaceCommands),slashCommands:Y_(r.slashCommands)}}function C_(n,r){if(!Array.isArray(n))return!0;return n.some((i)=>i.toLowerCase()===r.toLowerCase())}function no(n){let r=Array.isArray(n?.commands)?n.commands:[],i=sr(n?.settings),c=String(n?.query||"");return r.filter((_)=>C_(i.workspaceCommands,_.id)).filter((_)=>Oi(c,_.label,_.description,..._.keywords||[])).map((_)=>({key:`workspace:${_.id}`,kind:"workspace",title:_.label,subtitle:_.description,searchText:`${_.label} ${_.description} ${(_.keywords||[]).join(" ")}`.trim(),visualHint:_.label.slice(0,1).toUpperCase()||"W",categoryLabel:"Workspace",actionHint:"Run",commandId:_.id}))}function ro(n){let r=Array.isArray(n?.agents)?n.agents:[],i=String(n?.query||""),c=new Set;return r.filter((_)=>{let u=dn(_?.chat_jid)?_.chat_jid.trim():"";if(!u||c.has(u))return!1;if(_?.archived_at)return!1;return c.add(u),!0}).filter((_)=>Oi(i,`@${String(_?.agent_name||"").trim()}`,_?.session_name,_?.chat_jid)).map((_)=>{let u=dn(_?.agent_name)?_.agent_name.trim():String(_?.chat_jid||"").replace(/^[^:]+:/,""),f=dn(_?.session_name)?_.session_name.trim():"",o=String(_?.chat_jid||"").trim();return{key:`agent:${o}`,kind:"agent",title:`@${u}`,subtitle:f||o,searchText:`@${u} ${f} ${o}`.trim(),visualHint:u.slice(0,1).toUpperCase()||"@",categoryLabel:"Agent",actionHint:"Open",chatJid:o}})}function io(n){let r=Array.isArray(n?.slashCommands)?n.slashCommands:[],i=sr(n?.settings),c=String(n?.query||""),_=new Set;return r.filter((u)=>{let f=dn(u?.name)?u.name.trim():"";if(!f||_.has(f.toLowerCase()))return!1;return _.add(f.toLowerCase()),C_(i.slashCommands,f)}).filter((u)=>Oi(c,u?.name,u?.description,u?.source)).map((u)=>{let f=String(u?.name||"").trim(),o=dn(u?.description)?u.description.trim():"slash command",s=dn(u?.source)?u.source.trim():"";return{key:`slash:${f}`,kind:"slash",title:f,subtitle:o,searchText:`${f} ${o} ${String(u?.source||"")}`.trim(),visualHint:"/",categoryLabel:s||"Slash",actionHint:"Insert",commandName:f}})}function gs(n){return[...ro({agents:n?.agents,query:n?.query}),...no({commands:n?.workspaceCommands,settings:n?.settings,query:n?.query}),...io({slashCommands:n?.slashCommands,settings:n?.settings,query:n?.query})]}var En;var O_=Z(()=>{En=[{id:"toggle-workspace",label:"Toggle workspace",description:"Show or hide the workspace sidebar.",keywords:["workspace","sidebar","explorer"]},{id:"open-explorer",label:"Open explorer",description:"Open the workspace explorer sidebar.",keywords:["workspace","explorer","sidebar"]},{id:"toggle-chat-only",label:"Chat-only mode",description:"Toggle chat-only mode.",keywords:["chat","mode","layout"]},{id:"open-terminal-tab",label:"Open terminal in tab",description:"Open the terminal pane in a workspace tab.",keywords:["terminal","shell","tab"]},{id:"open-vnc-tab",label:"Open VNC in tab",description:"Open the VNC viewer in a workspace tab.",keywords:["vnc","remote","desktop","tab"]},{id:"toggle-terminal-dock",label:"Toggle terminal dock",description:"Show or hide the terminal dock.",keywords:["terminal","dock","shell"]},{id:"open-settings",label:"Settings",description:"Open the settings dialog.",keywords:["settings","preferences","config"]}]});var d_={};cn(d_,{QuickActionsSection:()=>co});function e_(n,...r){let i=String(n||"").trim().toLowerCase();if(!i)return!0;return r.some((c)=>String(c||"").toLowerCase().includes(i))}function J_(n){if(!Array.isArray(n))return null;return new Set(n.map((r)=>String(r||"").trim().toLowerCase()).filter(Boolean))}function co({filter:n="",setStatus:r,mergeSettingsData:i}){let[c,_]=$(()=>En.map((z)=>z.id)),[u,f]=$([]),[o,s]=$([]),[g,v]=$(!0),[t,b]=$(!1),h=R(async()=>{v(!0);try{let[z,j]=await Promise.all([vi(),xi("web:default").catch(()=>({commands:[]}))]),X=sr(z?.settings),w=Array.isArray(j?.commands)?j.commands:[];s(w),_(Array.isArray(X.workspaceCommands)?X.workspaceCommands:En.map((G)=>G.id)),f(Array.isArray(X.slashCommands)?X.slashCommands:w.map((G)=>String(G?.name||"").trim()).filter(Boolean))}catch(z){r?.(String(z?.message||z),"error")}finally{v(!1)}},[r]);M(()=>{h()},[h]);let x=I(()=>J_(c),[c]),F=I(()=>J_(u),[u]),y=I(()=>En.filter((z)=>e_(n,z.label,z.description,...z.keywords||[])),[n]),K=I(()=>o.filter((z)=>e_(n,z?.name,z?.description,z?.source)),[o,n]),T=R((z)=>{_((j)=>{let X=new Set((Array.isArray(j)?j:[]).map((w)=>String(w||"").trim()).filter(Boolean));if(X.has(z))X.delete(z);else X.add(z);return En.map((w)=>w.id).filter((w)=>X.has(w))})},[]),L=R((z)=>{f((j)=>{let X=new Set((Array.isArray(j)?j:[]).map((w)=>String(w||"").trim()).filter(Boolean));if(X.has(z))X.delete(z);else X.add(z);return o.map((w)=>String(w?.name||"").trim()).filter((w)=>w&&X.has(w))})},[o]),k=R(()=>{_(En.map((z)=>z.id)),f(o.map((z)=>String(z?.name||"").trim()).filter(Boolean))},[o]),U=R(async()=>{if(t)return;b(!0),r?.("Saving quick actions…","info");try{let z=await bi({workspaceCommands:c,slashCommands:u}),j=sr(z?.settings);i?.({quickActions:j}),window.dispatchEvent(new CustomEvent("piclaw:quick-actions-settings-updated",{detail:{settings:j}})),r?.("Quick Actions saved.","success")}catch(z){r?.(String(z?.message||z),"error")}finally{b(!1)}},[i,t,r,u,c]);if(g)return l`<div class="settings-loading">Loading…</div>`;return l`
        <div class="settings-section">
            <h3>Timeline Quick Actions</h3>
            <p class="settings-hint">
                Choose which actions appear in the timeline typeahead. Agents are always pinned first, then workspace commands, then slash commands.
            </p>

            <div class="settings-row" style="align-items:center; gap:10px; margin-bottom:12px;">
                <button class="settings-addon-btn" onClick=${k} disabled=${t}>Enable all</button>
                <button class="settings-addon-btn settings-addon-btn-install" onClick=${U} disabled=${t}>
                    ${t?"Saving…":"Save & apply"}
                </button>
            </div>

            <h3 style="margin-top:8px;">Workspace commands</h3>
            <div class="settings-subsection-list">
                ${y.map((z)=>{let j=x?x.has(z.id.toLowerCase()):!0;return l`
                        <label class="settings-checkbox-row" key=${z.id}>
                            <input type="checkbox" checked=${j} onChange=${()=>T(z.id)} />
                            <div>
                                <div>${z.label}</div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${z.description}</div>
                            </div>
                        </label>
                    `})}
                ${y.length===0&&l`<div class="settings-hint">No workspace commands match this filter.</div>`}
            </div>

            <h3 style="margin-top:20px;">Slash commands</h3>
            <div class="settings-subsection-list">
                ${K.map((z)=>{let j=String(z?.name||"").trim(),X=F?F.has(j.toLowerCase()):!0;return l`
                        <label class="settings-checkbox-row" key=${j}>
                            <input type="checkbox" checked=${X} onChange=${()=>L(j)} />
                            <div>
                                <div><code>${j}</code></div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${z?.description||"slash command"}</div>
                            </div>
                        </label>
                    `})}
                ${K.length===0&&l`<div class="settings-hint">No slash commands match this filter.</div>`}
            </div>
        </div>
    `}var E_=Z(()=>{m();bn();O_()});var S_={};cn(S_,{KeychainSection:()=>fo});function _o(n){if(!n)return"—";try{return new Date(n).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"})}catch{return n}}function fo({filter:n=""}){let[r,i]=$([]),[c,_]=$(!0),[u,f]=$(null),[o,s]=$(!1),[g,v]=$(""),[t,b]=$(""),[h,x]=$(""),[F,y]=$(""),[K,T]=$(""),[L,k]=$("secret"),[U,z]=$(!1),[j,X]=$({}),[w,G]=$(null),[B,p]=$(null),[H,A]=$(null),C=D(null),O=D(null),gn=D(null),nn=R(async()=>{_(!0),f(null);try{let Q=await(await fetch("/agent/keychain")).json();if(Q?.ok)i(Q.entries||[]);else f(Q?.error||"Failed to load keychain.")}catch(W){f("Failed to load keychain.")}finally{_(!1)}},[]);M(()=>{nn()},[nn]);let fn=R(async()=>{let W=g.trim(),Q=t;if(!W||!Q)return;z(!0);try{let sn=await(await fetch("/agent/keychain",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:W,secret:Q,type:L,username:h.trim()||void 0,userNote:F,agentNote:K})})).json();if(sn?.ok)v(""),b(""),x(""),y(""),T(""),k("secret"),s(!1),await nn();else f(sn?.error||"Failed to add entry.")}catch{f("Failed to add entry.")}finally{z(!1)}},[g,t,h,F,K,L,nn]),on=R(async(W)=>{try{let rn=await(await fetch("/agent/keychain",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:W})})).json();if(rn?.ok)p(null),A((sn)=>sn?.name===W?null:sn),await nn();else f(rn?.error||"Failed to delete entry.")}catch{f("Failed to delete entry.")}},[nn]),wn=R(async(W)=>{let Q=W?.name;if(!Q)return;let rn=j[Q]||{},sn=Object.prototype.hasOwnProperty.call(rn,"userNote")?rn.userNote:W.userNote||"",$n=Object.prototype.hasOwnProperty.call(rn,"agentNote")?rn.agentNote:W.agentNote||"";G(Q);try{let Rn=await(await fetch("/agent/keychain/notes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:Q,userNote:sn,agentNote:$n})})).json();if(Rn?.ok)X(($r)=>{let mn={...$r||{}};return delete mn[Q],mn}),await nn();else f(Rn?.error||"Failed to save notes.")}catch{f("Failed to save notes.")}finally{G(null)}},[j,nn]),Y=R((W,Q,rn)=>{X((sn)=>({...sn||{},[W]:{...(sn||{})[W]||{},[Q]:rn}}))},[]),P=R(async(W,Q,rn)=>{try{let $n=await(await fetch("/agent/keychain/reveal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:W,master_password:Q||void 0,totp_code:rn||void 0})})).json();if($n?.ok)A({name:W,phase:"revealed",secret:$n.secret,username:$n.username,masterPassword:Q});else if($n?.needs_master_password)A((hn)=>({name:W,phase:"password",masterPassword:"",error:hn?.name===W&&hn?.masterPassword?$n.error:null})),requestAnimationFrame(()=>O.current?.focus());else if($n?.needs_totp)A((hn)=>({name:W,phase:"totp",masterPassword:Q,totpCode:"",error:hn?.name===W&&hn?.phase==="totp"&&hn?.totpCode?$n.error:null})),requestAnimationFrame(()=>gn.current?.focus());else A({name:W,phase:"error",error:$n?.error||"Failed to reveal."})}catch{A({name:W,phase:"error",error:"Failed to reveal."})}},[]),q=R((W)=>{if(H?.name===W&&H?.phase==="revealed"){A(null);return}P(W,null,null)},[H,P]),_n=R((W)=>{let Q=H?.masterPassword||"";if(!Q)return;P(W,Q,null)},[H,P]),N=R((W)=>{let Q=H?.totpCode||"";if(Q.length<6)return;P(W,H?.masterPassword,Q)},[H,P]),E=R(async(W)=>{try{await navigator.clipboard.writeText(W)}catch{let Q=document.createElement("textarea");Q.value=W,Q.style.position="fixed",Q.style.opacity="0",document.body.appendChild(Q),Q.select(),document.execCommand("copy"),document.body.removeChild(Q)}},[]);M(()=>{if(o)requestAnimationFrame(()=>C.current?.focus())},[o]);let un=n.toLowerCase(),kn=I(()=>{if(!un)return r;return r.filter((W)=>W.name.toLowerCase().includes(un)||(W.type||"").toLowerCase().includes(un)||(W.envVar||"").toLowerCase().includes(un)||(W.userNote||"").toLowerCase().includes(un)||(W.agentNote||"").toLowerCase().includes(un))},[r,un]);if(c)return l`<div class="settings-section"><div class="settings-loading">Loading keychain…</div></div>`;return l`
        <div class="settings-section">
            ${u&&l`
                <div class="settings-keychain-error" role="alert">
                    ${u}
                    <button class="settings-keychain-dismiss" onClick=${()=>f(null)}>✕</button>
                </div>
            `}
            <div class="settings-keychain-toolbar" style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <span class="settings-hint" style="margin:0; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span>${kn.length} entr${kn.length===1?"y":"ies"}${un?` matching "${n}"`:""}, encrypted at rest.</span>
                    <span style="display:inline-flex; align-items:center; gap:6px;">
                        <span>Click</span>
                        <span aria-hidden="true" style="display:inline-flex; width:18px; height:18px; align-items:center; justify-content:center; border-radius:999px; border:1px solid var(--border-color, rgba(120,120,120,.22)); background:var(--panel-bg, rgba(255,255,255,.04));">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </span>
                        <span>to reveal.</span>
                    </span>
                </span>
                <button class="settings-keychain-add-btn" onClick=${()=>s(!o)}>
                    ${o?"Cancel":"+ Add entry"}
                </button>
            </div>

            ${o&&l`
                <div class="settings-keychain-add-form">
                    <div class="settings-keychain-add-row">
                        <input ref=${C} type="text" placeholder="Entry name (e.g. github/my-token)"
                            value=${g} onInput=${(W)=>v(W.target.value)}
                            class="settings-keychain-input" />
                        <select value=${L} onChange=${(W)=>k(W.target.value)}
                            class="settings-keychain-select">
                            ${uo.map((W)=>l`<option value=${W}>${W}</option>`)}
                        </select>
                    </div>
                    <div class="settings-keychain-add-row">
                        <input type="password" placeholder="Secret value"
                            value=${t} onInput=${(W)=>b(W.target.value)}
                            class="settings-keychain-input settings-keychain-secret" />
                        <input type="text" placeholder="Username (optional)"
                            value=${h} onInput=${(W)=>x(W.target.value)}
                            class="settings-keychain-input" style="max-width:200px" />
                        <button class="settings-keychain-save-btn" onClick=${fn}
                            disabled=${U||!g.trim()||!t}>
                            ${U?"Saving…":"Save"}
                        </button>
                    </div>
                    <div class="settings-keychain-add-row" style="align-items:stretch">
                        <textarea placeholder="User note (visible in this UI only)"
                            value=${F} onInput=${(W)=>y(W.target.value)}
                            class="settings-keychain-input" rows="2" style="resize:vertical; min-height:56px"></textarea>
                        <textarea placeholder="Agent note (safe to expose to agents)"
                            value=${K} onInput=${(W)=>T(W.target.value)}
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
                        ${kn.length===0&&l`
                            <tr><td colspan="5" class="settings-keychain-empty">
                                ${un?"No entries match the filter.":"No keychain entries."}
                            </td></tr>
                        `}
                        ${kn.map((W)=>{let Q=H?.name===W.name?H:null,rn=Q?.phase==="revealed",sn=Q?.phase==="password",$n=Q?.phase==="totp",hn=Q?.phase==="error",Rn=j[W.name]||{},$r=Object.prototype.hasOwnProperty.call(Rn,"userNote")?Rn.userNote:W.userNote||"",mn=Object.prototype.hasOwnProperty.call(Rn,"agentNote")?Rn.agentNote:W.agentNote||"",hu=$r!==(W.userNote||"")||mn!==(W.agentNote||""),mi=w===W.name;return l`
                            <tr class="settings-keychain-row" key=${W.name}>
                                <td class="settings-keychain-name">${W.name}</td>
                                <td><span class="settings-keychain-type-badge">${W.type}</span></td>
                                <td class="settings-keychain-env">${W.envVar?l`<code>$${W.envVar}</code>`:"—"}</td>
                                <td class="settings-keychain-date">${_o(W.updatedAt)}</td>
                                <td class="settings-keychain-actions">
                                    <button class=${`settings-keychain-reveal-btn${rn?" active":""}`}
                                        onClick=${()=>q(W.name)}
                                        title=${rn?"Hide secret":"Reveal secret"}>
                                        ${rn?l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                                    </button>
                                    ${B===W.name?l`
                                            <span class="settings-keychain-confirm">Delete?
                                                <button class="settings-keychain-confirm-yes" onClick=${()=>on(W.name)}>Yes</button>
                                                <button class="settings-keychain-confirm-no" onClick=${()=>p(null)}>No</button>
                                            </span>
                                        `:l`<button class="settings-keychain-delete-btn" onClick=${()=>p(W.name)} title="Delete">🗑</button>`}
                                </td>
                            </tr>
                            <tr class="settings-keychain-notes-row" key=${W.name+"-notes"}>
                                <td colspan="5">
                                    <div style="display:grid; grid-template-columns:1fr 1fr auto; gap:8px; align-items:start; padding:8px 0 10px 0;">
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">User note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Human/UI note only"
                                                value=${$r}
                                                onInput=${(tn)=>Y(W.name,"userNote",tn.target.value)}></textarea>
                                        </label>
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">Agent-readable note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Safe guidance for agents"
                                                value=${mn}
                                                onInput=${(tn)=>Y(W.name,"agentNote",tn.target.value)}></textarea>
                                        </label>
                                        <button class="settings-keychain-save-btn" style="margin-top:20px" disabled=${!hu||mi} onClick=${()=>wn(W)}>
                                            ${mi?"Saving…":"Save notes"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ${sn&&l`
                                <tr class="settings-keychain-prompt-row" key=${W.name+"-pw"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">Master password:</span>
                                            <input ref=${O} type="password" autocomplete="off"
                                                placeholder="Enter keychain master password"
                                                class="settings-keychain-prompt-input"
                                                value=${Q?.masterPassword||""}
                                                onInput=${(tn)=>A((Zr)=>({...Zr,masterPassword:tn.target.value}))}
                                                onKeyDown=${(tn)=>{if(tn.key==="Enter")_n(W.name);if(tn.key==="Escape")A(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>_n(W.name)}
                                                disabled=${!Q?.masterPassword}>Unlock</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>A(null)}>Cancel</button>
                                            ${Q?.error&&l`<span class="settings-keychain-prompt-error">${Q.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${$n&&l`
                                <tr class="settings-keychain-prompt-row" key=${W.name+"-totp"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">TOTP code:</span>
                                            <input ref=${gn} type="text" inputmode="numeric" autocomplete="one-time-code"
                                                maxlength="6" placeholder="000000"
                                                class="settings-keychain-prompt-input" style="width:90px;text-align:center;letter-spacing:0.15em"
                                                value=${Q?.totpCode||""}
                                                onInput=${(tn)=>A((Zr)=>({...Zr,totpCode:tn.target.value.replace(/\\D/g,"").slice(0,6)}))}
                                                onKeyDown=${(tn)=>{if(tn.key==="Enter")N(W.name);if(tn.key==="Escape")A(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>N(W.name)}
                                                disabled=${(Q?.totpCode||"").length<6}>Verify</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>A(null)}>Cancel</button>
                                            ${Q?.error&&l`<span class="settings-keychain-prompt-error">${Q.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${rn&&l`
                                <tr class="settings-keychain-reveal-row" key=${W.name+"-reveal"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel">
                                            ${Q.username&&l`
                                                <div class="settings-keychain-reveal-field">
                                                    <span class="settings-keychain-reveal-label">Username</span>
                                                    <code class="settings-keychain-reveal-value">${Q.username}</code>
                                                    <button class="settings-keychain-copy-btn" onClick=${()=>E(Q.username)} title="Copy username">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                    </button>
                                                </div>
                                            `}
                                            <div class="settings-keychain-reveal-field">
                                                <span class="settings-keychain-reveal-label">Secret</span>
                                                <code class="settings-keychain-reveal-value">${Q.secret}</code>
                                                <button class="settings-keychain-copy-btn" onClick=${()=>E(Q.secret)} title="Copy secret">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${hn&&l`
                                <tr class="settings-keychain-reveal-row" key=${W.name+"-error"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel" style="color: var(--error-color, #e55)">${Q.error}</div>
                                    </td>
                                </tr>
                            `}
                        `})}
                    </tbody>
                </table>
            </div>
        </div>
    `}var uo;var m_=Z(()=>{m();uo=["secret","token","password","basic"]});var a_={};cn(a_,{ToolsSection:()=>go});function go({toolsets:n,filter:r="",settingsData:i,mergeSettingsData:c}){let _=n||[],[u,f]=$(()=>{let x={};for(let F of _)x[F.name]=!0;return x}),o=R((x)=>{f((F)=>({...F,[x]:!F[x]}))},[]),s=i?.searchMatchMode||"or",g=I(()=>{let x=Array.isArray(i?.toolResultCompactionTools)?i.toolResultCompactionTools:[];return new Set(x.filter((F)=>typeof F==="string").map((F)=>F.trim().toLowerCase()).filter(Boolean))},[i?.toolResultCompactionTools]),v=R(async()=>{let x=s==="or"?"and":"or";try{let y=await(await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({searchMatchMode:x})})).json().catch(()=>({}));if(y?.ok&&y?.settings)c?.(y.settings)}catch(F){console.warn("[settings/tools] Failed to save search match mode.",F)}},[s,c]),t=R(async(x)=>{let F=String(x||"").trim().toLowerCase();if(!F)return;let y=new Set(g);if(y.has(F))y.delete(F);else y.add(F);try{let T=await(await fetch("/agent/settings/compaction",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({toolResultCompactionTools:Array.from(y).sort()})})).json().catch(()=>({}));if(T?.ok&&T?.settings)c?.(T.settings)}catch(K){console.warn("[settings/tools] Failed to save tool compaction settings.",K)}},[g,c]),b=r.toLowerCase(),h=I(()=>{if(!b)return _;return _.map((x)=>{let F=x.tools.filter((y)=>y.name.toLowerCase().includes(b)||x.name.toLowerCase().includes(b)||(y.summary||"").toLowerCase().includes(b));return F.length>0?{...x,tools:F}:null}).filter(Boolean)},[_,b]);if(_.length===0)return l`<div class="settings-section"><p class="settings-hint">Tool data not available.</p></div>`;return l`
        <div class="settings-section">
            <div class="settings-search-options">
                <h4 style="margin:0 0 8px 0">Search</h4>
                <div class="settings-row">
                    <label>Match mode</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" checked=${s==="and"} onChange=${v} />
                        <span class="settings-hint" style="margin:0">
                            ${s==="or"?"Any keyword (OR) — results match at least one search term":"All keywords (AND) — results must match every search term"}
                        </span>
                    </div>
                </div>
            </div>
            ${h.map((x)=>{let F=u[x.name]!==!1;return l`
                <div class="settings-toolset">
                    <div class="settings-toolset-header">
                        <label class="settings-toolset-toggle">
                            <input type="checkbox" checked=${F} onChange=${()=>o(x.name)} />
                            <span class="settings-toolset-icon">${lo[x.name]||to}</span>
                            <strong>${x.name}</strong>
                        </label>
                        <span class="settings-hint" style="margin:0">${x.description}</span>
                    </div>
                    ${F&&l`<div class="settings-tool-list">
                        <div class="settings-tool-row settings-tool-row-header" aria-hidden="true">
                            <span class="settings-tool-status-header">Enabled</span>
                            <span class="settings-tool-name">Tool</span>
                            <span class="settings-tool-compact-header">Compact</span>
                            <span class="settings-tool-kind">Kind</span>
                            <span class="settings-tool-summary">Summary</span>
                            <span class="settings-tool-source">Source</span>
                        </div>
                        ${x.tools.map((y)=>{let K=String(y.name||"").trim().toLowerCase(),T=g.has(K);return l`
                                <div class="settings-tool-row">
                                    <input type="checkbox" checked disabled />
                                    <span class="settings-tool-name">${y.name}</span>
                                    <span class="settings-tool-compact">
                                        <input
                                            type="checkbox"
                                            checked=${T}
                                            onChange=${()=>t(y.name)}
                                            title=${T?"Disable tool-result compaction for this tool":"Enable tool-result compaction for this tool"}
                                        />
                                    </span>
                                    <span class="settings-tool-kind" title=${y.kind}>${so[y.kind]||"?"}</span>
                                    ${y.summary&&l`<span class="settings-tool-summary">${y.summary}</span>`}
                                    ${!y.summary&&l`<span class="settings-tool-summary"></span>`}
                                    <span class="settings-tool-source">${oo[y.name]||x.name}</span>
                                </div>
                            `})}
                    </div>`}
                </div>
            `})}
            ${h.length===0&&l`<p class="settings-hint">No tools match "${r}"</p>`}
            <p class="settings-hint">Tool activation is managed by the agent runtime. Group checkboxes collapse/expand; the “Compact” column controls tool-result compaction eligibility.</p>
        </div>
    `}var lo,oo,so,to;var nu=Z(()=>{m();lo={core:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M7.5 10l2.5 2-2.5 2"/><path d="M12.5 15H16"/></svg>`,discovery:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,attachments:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,"model-control":l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M9 15c.83.67 2 1 3 1s2.17-.33 3-1"/></svg>`,data:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,workspace:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,automation:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,remote:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,browser:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,ui:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,experiments:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v7l4.6 7.7A1 1 0 0 1 18.7 19H5.3a1 1 0 0 1-.9-1.3L9 10z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>`,lifecycle:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`},oo={read:"pi-core",write:"pi-core",edit:"pi-core",bash:"pi-core",powershell:"pi-core",find:"pi-core",grep:"pi-core",ls:"pi-core",list_tools:"internal-tools",activate_tools:"tool-activation",reset_active_tools:"tool-activation",list_scripts:"runtime-scripts",attach_file:"file-attachments",read_attachment:"file-attachments",export_attachment:"file-attachments",get_model_state:"model-control",list_models:"model-control",switch_model:"model-control",switch_thinking:"model-control",messages:"messages-crud",introspect_sql:"sql-introspect",keychain:"keychain-tools",search_workspace:"workspace-search",refresh_workspace_index:"workspace-search",open_office_viewer:"office-viewer",office_read:"office-viewer",office_write:"office-viewer",open_workspace_file:"open-workspace-file",image_process:"image-processing",schedule_task:"scheduled-tasks",scheduled_tasks:"scheduled-tasks",bun_run:"bun-runner",exec_batch:"exec-batch",search_tool_output:"search-tool-output",ssh:"ssh",proxmox:"proxmox",portainer:"portainer",mcp:"mcp",cdp_browser:"cdp-browser",send_adaptive_card:"send-adaptive-card",send_dashboard_widget:"send-dashboard-widget",start_autoresearch:"autoresearch",stop_autoresearch:"autoresearch",autoresearch_status:"autoresearch",exit_process:"exit-process",env:"env-tools"},so={"read-only":"\uD83D\uDD0D",mutating:"✏️",mixed:"\uD83D\uDD04"},to=l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`});var ru={};cn(ru,{AddonsSection:()=>$o});function $o({setStatus:n,filter:r=""}){let[i,c]=$(null),[_,u]=$(!0),[f,o]=$(null),[s,g]=$(!1),[v,t]=$({runtime:"",windowsNative:!1}),[b,h]=$([]),[x,F]=$([]);function y(){let w=new URLSearchParams;try{let B=(localStorage.getItem("piclaw_addons_catalog_url")||"").trim(),p=(localStorage.getItem("piclaw_addons_catalog_urls")||"").split(/\r?\n/).map((A)=>A.trim()).filter(Boolean),H=localStorage.getItem("piclaw_addons_repo_url");if(B)w.append("catalog_url",B);for(let A of p)w.append("catalog_url",A);if(H)w.set("repo_url",H)}catch(B){}let G=w.toString();return G?`?${G}`:""}let K=R(async()=>{try{let[w,G]=await Promise.all([fetch(`/agent/addons${y()}`),fetch("/agent/settings-data")]),B=await w.json();if(B.error)throw Error(B.error);c(B.addons||[]),h(B.sources||[]),F(B.failed_sources||[]);let p=await G.json().catch(()=>({})),H=typeof p?.runtimePlatform==="string"?p.runtimePlatform:"";t({runtime:H,windowsNative:H==="win32"})}catch(w){c(null),n?.(String(w.message||w),"error")}finally{u(!1)}},[n]);M(()=>{K()},[]);let T=R(async(w)=>{if(f)return;o({slug:w,action:"install"}),n?.(`Installing ${w}…`,"info");try{let B=await(await fetch(`/agent/addons/install${y()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:w})})).json();if(B.error){n?.(B.error,"error");return}g(!0);let p=[B.message,B.warning].filter(Boolean).join(" ");n?.(p||"Add-on installed.","success"),await K()}catch(G){n?.(String(G.message||G),"error")}finally{o(null)}},[f,K,n]),L=R(async(w)=>{if(f)return;o({slug:w,action:"remove"}),n?.(`Removing ${w}…`,"info");try{let B=await(await fetch(`/agent/addons/uninstall${y()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:w})})).json();if(B.error){n?.(B.error,"error");return}g(!0);let p=[B.message,B.warning].filter(Boolean).join(" ");n?.(p||"Add-on removed.","success"),await K()}catch(G){n?.(String(G.message||G),"error")}finally{o(null)}},[f,K,n]),k=R(async()=>{if(f)return;o({slug:null,action:"restart"}),n?.("Restarting piclaw…","info");try{let G=await(await fetch("/agent/addons/restart",{method:"POST"})).json();if(G.error){n?.(G.error,"error"),o(null);return}n?.(G.message||"Restarting piclaw…","success"),g(!1),(async(p=30,H=2000)=>{for(let A=0;A<p;A++){await new Promise((C)=>setTimeout(C,H));try{if((await fetch("/agent/addons",{signal:AbortSignal.timeout(3000)})).ok){await K(),o(null),n?.("Restart complete — add-ons refreshed.","success");return}}catch(C){}}o(null),n?.("Backend did not return in time. Reload the page manually.","warning")})()}catch(w){n?.(String(w.message||w),"error"),o(null)}},[f,n,K]);if(_)return l`<div class="settings-loading">Fetching add-ons\u2026</div>`;if(!i)return l`<div class="settings-section"><p class="settings-hint">Could not load add-ons.</p></div>`;let U=r.toLowerCase(),z=U?i.filter((w)=>w.slug.toLowerCase().includes(U)||(w.description||"").toLowerCase().includes(U)||(w.tags||[]).some((G)=>G.toLowerCase().includes(U))):i,j=f?.slug||null,X=f?f.action==="remove"?`Removing ${f.slug}…`:f.action==="restart"?"Restarting piclaw…":`Installing ${f.slug}…`:"";return l`
        <div class=${`settings-section settings-addon-panel${f?" busy":""}`} aria-busy=${f?"true":"false"}>
            <div class="settings-addon-toolbar">
                <div>
                    <p class="settings-hint">
                        ${b.length<=1?l`Catalog from <a href="https://github.com/rcarmo/piclaw-addons" target="_blank">rcarmo/piclaw-addons</a>.`:l`${b.length} catalog sources merged.`}
                        ${" "}Package-first install via Bun; restart required after install/uninstall.
                    </p>
                    ${x.length>0&&l`
                        <div class="settings-addon-error" role="alert">
                            Failed to fetch ${x.length} catalog source${x.length>1?"s":""}:
                            ${x.map((w)=>l` <code style="font-size:0.82em;word-break:break-all">${w}</code>`)}
                        </div>
                    `}
                    ${b.length>1&&l`
                        <details class="settings-hint" style="margin-top:4px">
                            <summary style="cursor:pointer">Active catalog sources (${b.length})</summary>
                            <ul style="margin:4px 0 0 16px;font-size:0.82em">
                                ${b.map((w)=>l`<li style="word-break:break-all"><code>${w}</code></li>`)}
                            </ul>
                        </details>
                    `}
                    ${v.windowsNative&&l`
                        <div class="settings-addon-error" role="alert">
                            Native Windows add-on installs are higher risk: Bun package installs, symlink cleanup, locked files, and restart timing can all be less predictable than in Linux/WSL. Prefer WSL or a container when possible.
                        </div>
                    `}
                </div>
            </div>
            <div class="settings-addon-list">
                ${f&&l`
                    <div class="settings-addon-panel-overlay" role="status" aria-live="polite" aria-label=${X}>
                        <div class="settings-addon-panel-overlay-card">
                            <div class="settings-spinner"></div>
                            <span>${X}</span>
                        </div>
                    </div>
                `}
                ${z.map((w)=>{let G=(w.skills||[]).length>0,B=w.type==="extension",p=G&&B?"extension + skill":G?"skill":"extension",H=G&&!B?"settings-tag-skill":"",A=typeof w.homepage==="string"&&w.homepage.trim()?w.homepage.trim():"";return l`
                    <div class=${`settings-addon-card${w.installed?" installed":""}`}>
                        <div class="settings-addon-card-header">
                            ${A?l`<a class="settings-addon-name-link" href=${A} target="_blank" rel="noopener noreferrer">${w.slug}</a>`:l`<strong>${w.slug}</strong>`}
                            <span class=${`settings-tag settings-tag-type ${H}`}>${p}</span>
                            <span class="settings-addon-version">${w.installed?w.installedVersion||"?":w.version||""}</span>
                            ${w.installKind&&l`<span class="settings-tag">${w.installKind}</span>`}
                            ${w.hasUpdate&&l`<span class="settings-tag settings-tag-skill">\u2191 ${w.version}</span>`}
                            <div class="settings-addon-actions">
                                ${w.installed?l`
                                    ${w.hasUpdate&&l`<button class="settings-addon-btn settings-addon-btn-upgrade" disabled=${Boolean(f)} onClick=${()=>T(w.slug)}>${j===w.slug?"…":"Update"}</button>`}
                                    <button class="settings-addon-btn settings-addon-btn-remove" disabled=${Boolean(f)} onClick=${()=>L(w.slug)}>${j===w.slug?"…":"Remove"}</button>
                                `:l`
                                    <button class="settings-addon-btn settings-addon-btn-install" disabled=${Boolean(f)} onClick=${()=>T(w.slug)}>${j===w.slug?"…":"Install"}</button>
                                `}
                            </div>
                        </div>
                        <div class="settings-addon-card-body">${w.description}</div>
                        <div class="settings-addon-card-footer">
                            <div class="settings-addon-tags">${(w.tags||[]).map((C)=>l`<span class="settings-tag">${C}</span>`)}${(w.skills||[]).map((C)=>l`<span class="settings-tag settings-tag-skill">\ud83d\udcdd ${C}</span>`)}</div>
                        </div>
                    </div>
                `})}
                ${z.length===0&&l`<p class="settings-hint">No add-ons match "${r}"</p>`}
            </div>
            ${s&&l`
                <div class="settings-addon-restart-notice" role="status" aria-live="polite">
                    <span>Extension changes are installed but inactive until piclaw restarts.</span>
                    <button class="settings-addon-btn settings-addon-btn-restart-now" type="button" disabled=${Boolean(f)} onClick=${k}>Restart Now</button>
                </div>
            `}
        </div>
    `}var iu=Z(()=>{m()});var bo={};function ei(n,r){try{let i=localStorage.getItem(n);return i===null?r:i==="true"}catch{return r}}function Ar(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function wo(n,r){try{return localStorage.getItem(n)||r}catch{return r}}function yo(n,r){try{localStorage.setItem(n,r)}catch(i){}}function po(n,r,i,c){try{return Kn(localStorage.getItem(n),{fallback:r,min:i,max:c})}catch{return Kn(r,{fallback:r,min:i,max:c})}}function ho(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function xo(){let[n,r]=$(()=>ei("piclaw_vim_mode",!1)),[i,c]=$(()=>ei("piclaw_show_whitespace",!0)),[_,u]=$(()=>ei("piclaw_md_live_preview",!0)),[f,o]=$(()=>po("piclaw_editor_font_size",13,10,24)),[s,g]=$(()=>wo("piclaw_editor_font_family","")),v=R((t,b,h)=>{let x=!b;h(x),Ar(t,x)},[]);return l`
        <div class="settings-section">
            <h3>Editor</h3>
            <div class="settings-row">
                <label>Vim mode</label>
                <input type="checkbox" checked=${n}
                    onChange=${()=>{let t=!n;r(t),Ar("piclaw_vim_mode",t)}} />
            </div>
            <div class="settings-row">
                <label>Show whitespace</label>
                <input type="checkbox" checked=${i}
                    onChange=${()=>{let t=!i;c(t),Ar("piclaw_show_whitespace",t)}} />
            </div>
            <div class="settings-row">
                <label>Markdown live preview</label>
                <input type="checkbox" checked=${_}
                    onChange=${()=>{let t=!_;u(t),Ar("piclaw_md_live_preview",t)}} />
            </div>
            <div class="settings-row">
                <label>Font size (px)</label>
                <${d}
                    label="editor font size"
                    value=${f}
                    min=${10}
                    max=${24}
                    fallback=${13}
                    width="70px"
                    onChange=${(t)=>{o(t),ho("piclaw_editor_font_size",t)}}
                />
            </div>
            <div class="settings-row">
                <label>Font family</label>
                <input type="text" value=${s}
                    onInput=${(t)=>{let b=t.target.value;g(b),yo("piclaw_editor_font_family",b)}}
                    placeholder="monospace (default)" />
            </div>
            <p class="settings-hint settings-local-only-hint">This browser only. Editor changes are stored in local browser storage and take effect when you next open or reload a file tab.</p>
        </div>
    `}var vo;var cu=Z(()=>{m();Dn();Vn();vo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;jn({id:"editor",label:"Editor",icon:vo,component:xo,order:150})});var Bo={};function _u(n,r){try{let i=localStorage.getItem(n);return i===null?r:i==="true"}catch{return r}}function uu(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function Ko(n,r,i,c){try{return Kn(localStorage.getItem(n),{fallback:r,min:i,max:c})}catch{return Kn(r,{fallback:r,min:i,max:c})}}function zo(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function Fo(){let[n,r]=$(()=>_u("piclaw_mindmap_auto_expand",!0)),[i,c]=$(()=>Ko("piclaw_mindmap_node_spacing",40,20,100)),[_,u]=$(()=>_u("piclaw_mindmap_animate",!0));return l`
        <div class="settings-section">
            <h3>Mind Map</h3>
            <div class="settings-row">
                <label>Auto-expand nodes</label>
                <input type="checkbox" checked=${n}
                    onChange=${()=>{let f=!n;r(f),uu("piclaw_mindmap_auto_expand",f)}} />
            </div>
            <div class="settings-row">
                <label>Node spacing (px)</label>
                <${d}
                    label="node spacing"
                    value=${i}
                    min=${20}
                    max=${100}
                    fallback=${40}
                    width="70px"
                    onChange=${(f)=>{c(f),zo("piclaw_mindmap_node_spacing",f)}}
                />
            </div>
            <div class="settings-row">
                <label>Animate transitions</label>
                <input type="checkbox" checked=${_}
                    onChange=${()=>{let f=!_;u(f),uu("piclaw_mindmap_animate",f)}} />
            </div>
            <p class="settings-hint settings-local-only-hint">This browser only. Opens <code>.mindmap.yaml</code> files. Changes take effect on the next map open.</p>
        </div>
    `}var ko;var fu=Z(()=>{m();Dn();Vn();ko=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="9.5" y1="9.5" x2="6.5" y2="6.5"/><line x1="14.5" y1="9.5" x2="17.5" y2="6.5"/><line x1="9.5" y1="14.5" x2="6.5" y2="17.5"/><line x1="14.5" y1="14.5" x2="17.5" y2="17.5"/></svg>`;jn({id:"mindmap",label:"Mind Map",icon:ko,component:Fo,order:170})});var Wo={};function Ji(n,r){try{let i=localStorage.getItem(n);return i===null?r:i==="true"}catch{return r}}function di(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function Ei(n,r){try{return localStorage.getItem(n)||r}catch{return r}}function Si(n,r){try{localStorage.setItem(n,r)}catch(i){}}function To(){let[n,r]=$(()=>Ji("piclaw_dev_mode",!1)),[i,c]=$(()=>Ei("piclaw_addons_catalog_url","")),[_,u]=$(()=>Ei("piclaw_addons_catalog_urls","")),[f,o]=$(()=>Ei("piclaw_addons_repo_url","")),[s,g]=$(()=>Ji("piclaw_debug_sse",!1)),[v,t]=$(()=>Ji("piclaw_debug_tool_calls",!1)),b=R(()=>{let h=!n;r(h),di("piclaw_dev_mode",h)},[n]);return l`
        <div class="settings-section">
            <h3>Developer</h3>
            <div class="settings-row">
                <label>Developer mode</label>
                <input type="checkbox" checked=${n} onChange=${b} />
            </div>

            <p class="settings-hint settings-local-only-hint">This browser only. Developer-mode toggles and add-on catalog overrides are stored in local browser storage.</p>

            ${n&&l`
                <h3 style="margin-top:16px">Add-on Sources</h3>
                <div class="settings-row">
                    <label>Catalog URL</label>
                    <input type="text" value=${i}
                        onInput=${(h)=>{let x=h.target.value;c(x),Si("piclaw_addons_catalog_url",x)}}
                        placeholder="https://raw.githubusercontent.com/.../catalog.json" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Primary add-on catalog URL. Leave empty to use the default (<code>rcarmo/piclaw-addons</code>).</p>
                <div class="settings-row" style="align-items:flex-start;">
                    <label>Additional catalog URLs</label>
                    <textarea
                        value=${_}
                        onInput=${(h)=>{let x=h.target.value;u(x),Si("piclaw_addons_catalog_urls",x)}}
                        placeholder="One URL per line\nhttps://example.com/catalog.json"
                        style="max-width:400px; min-height:86px; resize:vertical;"
                    ></textarea>
                </div>
                <p class="settings-hint" style="margin-top:0">Fetched in addition to the primary/default catalog. One URL per line.</p>
                <div class="settings-row">
                    <label>Repo URL</label>
                    <input type="text" value=${f}
                        onInput=${(h)=>{let x=h.target.value;o(x),Si("piclaw_addons_repo_url",x)}}
                        placeholder="https://github.com/.../piclaw-addons.git" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Override the git repo used for <code>bun add</code> installs. Leave empty for default.</p>

                <h3 style="margin-top:16px">Debug</h3>
                <div class="settings-row">
                    <label>Log SSE events</label>
                    <input type="checkbox" checked=${s}
                        onChange=${()=>{let h=!s;g(h),di("piclaw_debug_sse",h)}} />
                </div>
                <div class="settings-row">
                    <label>Log tool calls</label>
                    <input type="checkbox" checked=${v}
                        onChange=${()=>{let h=!v;t(h),di("piclaw_debug_tool_calls",h)}} />
                </div>
                <p class="settings-hint">Debug flags take effect on next page reload.</p>
            `}
        </div>
    `}var jo;var lu=Z(()=>{m();Dn();jo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;jn({id:"developer",label:"Developer",icon:jo,component:To,order:900})});var Eo={};cn(Eo,{openSettingsDialog:()=>Jo,SettingsDialogContent:()=>Dr,SettingsDialog:()=>eo});function gr(n){tr.push({ts:performance.now(),label:n})}function Ro(){if(!tr.length)return;let n=tr[0].ts,r=tr.map((i)=>`+${(i.ts-n).toFixed(1)}ms ${i.label}`);console.info(`[settings-dialog perf]
`+r.join(`
`));try{window.__piclawSettingsPerfLog=r}catch(i){}try{fetch("/agent/client-perf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({label:"settings-dialog",lines:r})}).catch((i)=>{})}catch(i){}tr.length=0}function Ho(n){let r=Ir.get(n);if(r)return Promise.resolve(r);let i=Qr.get(n);if(i)return i;let c=Uo[n]().then((_)=>{return Ir.set(n,_),Qr.delete(n),_}).catch((_)=>{throw Qr.delete(n),_});return Qr.set(n,c),c}function qr(n="Loading…"){return l`
        <div class="settings-loading settings-loading-pane" role="status" aria-live="polite">
            <span class="settings-spinner"></span>
            <span>${n}</span>
        </div>
    `}function Dr({onClose:n}){gr("SettingsDialogContent-render-start");let[r,i]=$(()=>_i()||"general"),[c,_]=$(ou),[u,f]=$(null),[o,s]=$(""),[,g]=$(0),[v,t]=$(()=>Object.fromEntries(Ir.entries())),[b,h]=$(null),[x,F]=$({compact:!1,narrow:!1}),y=D(null),K=D(null);M(()=>{gr("SettingsDialogContent-mounted"),Ro()},[]),M(()=>{let p=(H)=>{if(H.key==="Escape")n()};return window.addEventListener("keydown",p),()=>window.removeEventListener("keydown",p)},[n]),M(()=>{let p=(H)=>{let A=typeof H?.detail?.section==="string"?H.detail.section.trim():"";if(A)i(A),s("")};return window.addEventListener("piclaw:open-settings",p),()=>window.removeEventListener("piclaw:open-settings",p)},[]),M(()=>{let p=()=>g((H)=>H+1);return window.addEventListener("piclaw:settings-panes-changed",p),()=>window.removeEventListener("piclaw:settings-panes-changed",p)},[]),M(()=>{fetch("/agent/settings-data").then((p)=>p.json()).then((p)=>{ou=p,_(p)}).catch(()=>_({}))},[]),M(()=>{let p=K.current;if(!p)return;let H=()=>{let A=p.clientWidth||0;F((C)=>{let O={compact:A>0&&A<=860,narrow:A>0&&A<=720};return C.compact===O.compact&&C.narrow===O.narrow?C:O})};if(H(),typeof ResizeObserver==="function"){let A=new ResizeObserver(()=>H());return A.observe(p),()=>A.disconnect()}return window.addEventListener("resize",H),()=>window.removeEventListener("resize",H)},[]);let T=[...tu].sort((p,H)=>(p.order??500)-(H.order??500)),k=Rc().map((p)=>({id:p.id,label:p.label,icon:p.icon,searchable:p.searchable||!1,placeholder:p.searchPlaceholder,order:p.order??500,isExtension:!0,component:p.component})).sort(ci),U=[...T,...k],z=U.find((p)=>p.id===r)||tu.find((p)=>p.id===r);M(()=>{if(z?.searchable)requestAnimationFrame(()=>y.current?.focus())},[r]),M(()=>{if(z?.isExtension){h(null);return}let p=!1;if(v[r]){h(null);return}return h(r),Ho(r).then((H)=>{if(p)return;t((A)=>A?.[r]?A:{...A||{},[r]:H})}).catch((H)=>{if(p)return;console.error(`[settings-dialog] Failed to lazy-load section "${r}".`,H)}).finally(()=>{if(!p)h((H)=>H===r?null:H)}),()=>{p=!0}},[r,z?.isExtension,v]);let j=R((p,H="info")=>{f(p?{text:p,type:H}:null)},[]),X=R((p)=>{i(p),s("");let H=Go[p];if(H&&!su.has(p))su.add(p),H().then(()=>g((A)=>A+1)).catch((A)=>{})},[]),w=R((p)=>{_((H)=>({...H||{},...p||{}}))},[]),G=()=>{if(z?.isExtension){if(!z.component)return qr("Loading pane…");let H=z.component;return l`<${H} filter=${o} />`}let p=v[r];if(!p||b===r)return qr(`Loading ${z?.label||"settings"}…`);switch(r){case"general":return l`<${p} settingsData=${c} setStatus=${j} mergeSettingsData=${w} />`;case"sessions":return l`<${p} settingsData=${c} setStatus=${j} mergeSettingsData=${w} />`;case"recordings":return l`<${p} filter=${o} setStatus=${j} />`;case"compaction":return l`<${p} settingsData=${c} setStatus=${j} mergeSettingsData=${w} />`;case"keyboard":return l`<${p} filter=${o} setStatus=${j} />`;case"workspace":return l`<${p} settingsData=${c} setStatus=${j} mergeSettingsData=${w} />`;case"environment":return l`<${p} settingsData=${c} filter=${o} setStatus=${j} mergeSettingsData=${w} />`;case"providers":return l`<${p} providers=${c?.providers} setStatus=${j} />`;case"models":return l`<${p} filter=${o} />`;case"theme":return l`<${p} themes=${c?.themes} colorKeys=${c?.colorKeys} settingsData=${c} setStatus=${j} mergeSettingsData=${w} />`;case"scheduled-tasks":return l`<${p} filter=${o} setStatus=${j} />`;case"quick-actions":return l`<${p} filter=${o} setStatus=${j} mergeSettingsData=${w} />`;case"keychain":return l`<${p} filter=${o} />`;case"tools":return l`<${p} toolsets=${c?.toolsets} filter=${o} settingsData=${c} mergeSettingsData=${w} />`;case"addons":return l`<${p} setStatus=${j} filter=${o} />`;default:return qr("Loading settings…")}},B=!z;return gr("SettingsDialogContent-render-end"),l`
        <div class="settings-dialog-backdrop" onClick=${(p)=>{if(p.target===p.currentTarget)n()}}>
            <div ref=${K} data-testid="settings-dialog" class=${`settings-dialog${x.compact?" settings-dialog-compact":""}${x.narrow?" settings-dialog-narrow":""}`}>
                <div class="settings-dialog-header">
                    <span class="settings-dialog-title">Settings</span>
                    ${z?.searchable&&l`
                        <input ref=${y} type="text" class="settings-header-filter"
                            placeholder=${z.placeholder||"Filter…"}
                            value=${o} onInput=${(p)=>s(p.target.value)} />
                    `}
                    <button class="settings-dialog-close" onClick=${n} title="Close (Esc)">✕</button>
                </div>
                <div class="settings-dialog-body">
                    <nav class="settings-nav">
                        ${U.map((p,H)=>{let A=H>0&&!U[H-1].isExtension,C=p.isExtension&&A;return l`
                                ${C&&l`<div class="settings-nav-separator"></div>`}
                                <button class=${`settings-nav-item ${p.id===r?"active":""}`} onClick=${()=>X(p.id)}>
                                    <span class="settings-nav-icon">${p.icon}</span>
                                    <span class="settings-nav-label">${p.label}</span>
                                </button>
                            `})}
                    </nav>
                    <main class="settings-content">
                        ${B?qr("Loading settings…"):G()}
                    </main>
                </div>
                ${u&&l`
                    <div class=${`settings-status-bar settings-status-bar-${u.type}`}>
                        ${u.type==="info"&&l`<span class="settings-spinner"></span>`}
                        <span>${u.text}</span>
                        ${u.type!=="info"&&l`<button class="settings-status-dismiss" onClick=${()=>f(null)}>✕</button>`}
                    </div>
                `}
            </div>
        </div>
    `}function eo(){let[n,r]=$(!1);if(M(()=>{let i=(_)=>{let u=Br(_?.detail?.section);if(u)try{window.__piclawSettingsRequestedSection=u}catch(f){}r(!0)};window.addEventListener("piclaw:open-settings",i);let c=Gc();if(c.open){if(c.section)try{window.__piclawSettingsRequestedSection=c.section}catch(_){}r(!0)}return()=>window.removeEventListener("piclaw:open-settings",i)},[]),!n)return null;return l`<${jc} className="settings-portal"><${Dr} onClose=${()=>r(!1)} /><//>`}function Jo(n={}){Uc(n)}var tr,ou=null,Ir,Qr,Uo,Go,su,Lo,No,Vo,Po,Mo,Xo,Ao,Qo,qo,Io,Do,Zo,Yo,Co,Oo,tu;var gu=Z(()=>{m();Wc();Dn();mc();tr=[];gr("module-eval-start");gr("imports-done");Ir=new Map,Qr=new Map;Ir.set("general",ji);Uo={general:()=>Promise.resolve(ji),sessions:()=>Promise.resolve().then(() => (r_(),n_)).then((n)=>n.SessionsSection),recordings:()=>Promise.resolve().then(() => (c_(),i_)).then((n)=>n.RecordingsSection),compaction:()=>Promise.resolve().then(() => (u_(),__)).then((n)=>n.CompactionSection),keyboard:()=>Promise.resolve().then(() => (w_(),$_)).then((n)=>n.KeyboardSection),workspace:()=>Promise.resolve().then(() => (F_(),z_)).then((n)=>n.WorkspaceSection),environment:()=>Promise.resolve().then(() => (B_(),k_)).then((n)=>n.EnvironmentSection),providers:()=>Promise.resolve().then(() => (j_(),T_)).then((n)=>n.ProvidersSection),models:()=>Promise.resolve().then(() => (R_(),W_)).then((n)=>n.ModelsSection),theme:()=>Promise.resolve().then(() => (Q_(),A_)).then((n)=>n.ThemeSection),"scheduled-tasks":()=>Promise.resolve().then(() => (D_(),I_)).then((n)=>n.ScheduledTasksSection),"quick-actions":()=>Promise.resolve().then(() => (E_(),d_)).then((n)=>n.QuickActionsSection),keychain:()=>Promise.resolve().then(() => (m_(),S_)).then((n)=>n.KeychainSection),tools:()=>Promise.resolve().then(() => (nu(),a_)).then((n)=>n.ToolsSection),addons:()=>Promise.resolve().then(() => (iu(),ru)).then((n)=>n.AddonsSection)},Go={"editor-settings":()=>Promise.resolve().then(() => (cu(),bo)).then(()=>{}),"mindmap-settings":()=>Promise.resolve().then(() => (fu(),Bo)).then(()=>{}),developer:()=>Promise.resolve().then(() => (lu(),Wo)).then(()=>{})},su=new Set;Lo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M8.5 5.9L9.6 2.3h4.8l1.1 3.6 3.7-.8 2.4 4.1-2.6 2.8 2.6 2.8-2.4 4.1-3.7-.8-1.1 3.6H9.6l-1.1-3.6-3.7.8-2.4-4.1L5 12 2.4 9.2l2.4-4.1z"/></svg>`,No=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,Vo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.2"/><path d="m13 10 4-2.5v9L13 14z"/></svg>`,Po=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 10 9 10"/><path d="M12 7v5l3 3"/></svg>`,Mo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,Xo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/><path d="M8 7v10"/><path d="M16 7v10"/></svg>`,Ao=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01"/><path d="M10 9h.01"/><path d="M14 9h.01"/><path d="M18 9h.01"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M7 17h10"/></svg>`,Qo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,qo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none"/><line x1="12" y1="9" x2="12" y2="5"/><circle cx="12" cy="4" r="1.5"/></svg>`,Io=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.53-.21-1.01-.55-1.36-.34-.36-.55-.84-.55-1.37 0-1.1.9-2 2-2h2.36c3.08 0 5.64-2.56 5.64-5.64C22.9 5.85 18.05 2 12 2z"/><circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none"/></svg>`,Do=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M7 3.5 4 6"/><path d="m17 3.5 3 2.5"/></svg>`,Zo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,Yo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,Co=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="14" r="3"/><path d="M11 14h9"/><path d="M16 14v-2"/><path d="M19 14v2"/></svg>`,Oo=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,tu=[{id:"general",label:"General",icon:Lo,searchable:!1,order:10},{id:"sessions",label:"Sessions",icon:No,searchable:!1,order:12},{id:"recordings",label:"Recordings",icon:Vo,searchable:!0,placeholder:"Filter recordings…",order:12.5},{id:"compaction",label:"Compaction",icon:Po,searchable:!1,order:13},{id:"keyboard",label:"Keyboard",icon:Ao,searchable:!0,placeholder:"Filter shortcuts…",order:14},{id:"workspace",label:"Workspace",icon:Mo,searchable:!1,order:15},{id:"environment",label:"Environment",icon:Xo,searchable:!0,placeholder:"Filter environment…",order:16},{id:"providers",label:"Providers",icon:Qo,searchable:!1,order:20},{id:"models",label:"Models",icon:qo,searchable:!0,placeholder:"Filter models…",order:30},{id:"theme",label:"Appearance",icon:Io,searchable:!1,order:40},{id:"scheduled-tasks",label:"Scheduled Tasks",icon:Do,searchable:!0,placeholder:"Filter scheduled tasks…",order:65},{id:"quick-actions",label:"Quick Actions",icon:Yo,searchable:!0,placeholder:"Filter quick actions…",order:70},{id:"keychain",label:"Keychain",icon:Co,searchable:!0,placeholder:"Filter entries…",order:75},{id:"tools",label:"Tools",icon:Zo,searchable:!0,placeholder:"Filter tools…",order:80},{id:"addons",label:"Add-ons",icon:Oo,searchable:!0,placeholder:"Filter add-ons…",order:90}]});m();gu();Dn();var So=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`;function mo({label:n,body:r,filter:i=""}){return l`
    <div class="settings-section">
      <h3>${n}</h3>
      <p class="settings-hint">Mock add-on pane rendered by the settings widget fixture.</p>
      <div class="settings-addon-grid">
        ${["Credentials","Routes","Runtime options"].filter((c)=>!i||c.toLowerCase().includes(String(i).toLowerCase())).map((c)=>l`
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
  `}function ao(){let n=[{id:"fixture-z-observability",label:"Observability",body:"Latency, traces, and metrics."},{id:"fixture-a-portainer",label:"Portainer",body:"Container endpoint settings."},{id:"fixture-m-proxmox",label:"Proxmox",body:"Cluster profile and token settings."},{id:"fixture-b-cheapskate",label:"Cheapskate",body:"Model cost controls."}];for(let r of n)jn({id:r.id,label:r.label,icon:So,searchable:!0,searchPlaceholder:`Filter ${r.label} settings…`,order:r.id==="fixture-z-observability"?1:999,component:(i)=>l`<${mo} label=${r.label} body=${r.body} filter=${i?.filter||""} />`})}var pn={userName:"Rui Carmo",assistantName:"Smith",userAvatar:"",assistantAvatar:"",composeUploadLimitMb:32,workspaceUploadLimitMb:256,widgetToken:"piclaw_widget_fixture_token_0123456789abcdef",searchMatchMode:"or",instanceTotp:{configured:!0,issuer:"Piclaw Fixture",label:"Piclaw Fixture:Rui Carmo",secret:"JBSWY3DPEHPK3PXP",otpauth:"otpauth://totp/Piclaw%20Fixture:Rui%20Carmo?secret=JBSWY3DPEHPK3PXP&issuer=Piclaw%20Fixture",qrSvg:'<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><rect width="96" height="96" rx="10" fill="#fff"/><g fill="#111"><rect x="10" y="10" width="22" height="22"/><rect x="64" y="10" width="22" height="22"/><rect x="10" y="64" width="22" height="22"/><rect x="40" y="14" width="8" height="8"/><rect x="52" y="26" width="8" height="8"/><rect x="42" y="42" width="10" height="10"/><rect x="62" y="46" width="8" height="8"/><rect x="76" y="60" width="8" height="8"/><rect x="48" y="72" width="8" height="8"/></g></svg>'},providers:[{id:"openai",label:"OpenAI",authType:"api_key",configured:!0},{id:"anthropic",label:"Anthropic",authType:"api_key",configured:!1},{id:"github-copilot",label:"GitHub Copilot",authType:"oauth",configured:!0}],models:["openai/gpt-5.1","anthropic/claude-sonnet-4-5","github-copilot/gpt-5.4-mini"],model_options:[{label:"openai/gpt-5.1",provider:"openai",name:"GPT-5.1",context_window:200000,reasoning:!0},{label:"anthropic/claude-sonnet-4-5",provider:"anthropic",name:"Claude Sonnet 4.5",context_window:200000,reasoning:!0},{label:"github-copilot/gpt-5.4-mini",provider:"github-copilot",name:"GPT-5.4 mini",context_window:128000,reasoning:!1}],current:"openai/gpt-5.1",thinking_level:"medium",supports_thinking:!0,available_thinking_levels:["off","minimal","low","medium","high"],themes:[{id:"system",label:"System",dark:!1},{id:"ipad-pro",label:"iPad Pro",dark:!0},{id:"terminal",label:"Terminal",dark:!0}],colorKeys:["accent","background","surface","text"],toolsets:[{name:"core",description:"Core shell and file tools",tools:[{name:"read",kind:"read-only"},{name:"bash",kind:"mutating"}]},{name:"ui",description:"Web UI posting tools",tools:[{name:"send_dashboard_widget",kind:"mutating"},{name:"send_adaptive_card",kind:"mutating"}]},{name:"remote",description:"Infrastructure tools",tools:[{name:"ssh",kind:"mixed"},{name:"proxmox",kind:"mixed"},{name:"portainer",kind:"mixed"}]}]},n0={current:pn.current,models:pn.models,model_options:pn.model_options,thinking_level:pn.thinking_level,supports_thinking:pn.supports_thinking,available_thinking_levels:pn.available_thinking_levels},$u={sources:["fixture-catalog"],failed_sources:[],addons:[{slug:"cheapskate",name:"Cheapskate",description:"Model cost controls and routing hints.",installed:!0,enabled:!0,version:"0.1.0",bundled:!1},{slug:"observability",name:"Observability",description:"Local metrics and tracing panels.",installed:!0,enabled:!0,version:"0.2.0",bundled:!1},{slug:"portainer",name:"Portainer",description:"Container management add-on.",installed:!1,enabled:!1,version:"0.3.0",bundled:!1},{slug:"proxmox",name:"Proxmox",description:"Proxmox inventory and workflow add-on.",installed:!0,enabled:!1,version:"0.4.0",bundled:!1}]},wu={entries:[{name:"github/piclaw-bot-pat",type:"token",envVar:"GITHUB_PICLAW_BOT_PAT",updatedAt:new Date().toISOString(),userNote:"Fixture note",agentNote:"Use only through env injection."},{name:"ssh/relay.local",type:"secret",envVar:"SSH_RELAY_LOCAL",updatedAt:new Date().toISOString(),userNote:"",agentNote:""}]},Sn=new URLSearchParams(window.location.search).get("real")!=="1",yu=window.fetch.bind(window);function yn(n,r=200){return new Response(JSON.stringify(n),{status:r,headers:{"Content-Type":"application/json"}})}function r0(){window.fetch=async(n,r)=>{let i=new URL(typeof n==="string"?n:n.url,window.location.href),c=String(r?.method||"GET").toUpperCase();if(!Sn)return yu(n,r);if(i.pathname==="/agent/settings-data")return yn(pn);if(i.pathname==="/agent/models")return yn(n0);if(i.pathname==="/agent/addons")return yn($u);if(i.pathname.startsWith("/agent/addons/"))return yn({ok:!0,message:"Fixture add-on action accepted.",...$u});if(i.pathname==="/agent/keychain"){if(c==="GET")return yn(wu);if(c==="POST")return yn({ok:!0,...wu})}if(i.pathname==="/agent/settings/general")return yn({ok:!0,settings:pn});if(i.pathname==="/agent/settings/widget-token/regenerate")return yn({ok:!0,settings:{...pn,widgetToken:`piclaw_widget_fixture_regenerated_${Date.now()}`}});if(i.pathname.startsWith("/agent/default/message"))return yn({command:{status:"success",message:"Fixture command accepted."}});if(i.pathname.startsWith("/agent/settings/"))return yn({ok:!0,settings:pn,items:[],entries:[]});if(i.pathname==="/agent/client-perf")return yn({ok:!0});return yu(n,r)}}function i0(){let n=document.createElement("style");n.textContent=`
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
  `,document.head.appendChild(n)}function pu(n){try{window.__piclawSettingsRequestedSection=n}catch(r){}window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:{section:n}}))}function c0(){let n=new URLSearchParams(window.location.search),[r,i]=$(n.get("section")||"general"),[c,_]=$(Number(n.get("width")||900)),[u,f]=$(Number(n.get("height")||640)),[o,s]=$(Sn),[g,v]=$(0),t=I(()=>["general","sessions","compaction","keyboard","workspace","environment","providers","models","theme","scheduled-tasks","quick-actions","keychain","tools","addons","fixture-b-cheapskate","fixture-z-observability","fixture-a-portainer","fixture-m-proxmox"],[]),b=R((x)=>{i(x),pu(x)},[]),h=R(()=>{Sn=!Sn,s(Sn),v((x)=>x+1)},[]);return l`
    <div class="settings-fixture-shell">
      <div class="settings-fixture-toolbar">
        <strong>Settings fixture</strong>
        <label>Section <select value=${r} onChange=${(x)=>b(x.target.value)}>${t.map((x)=>l`<option value=${x}>${x}</option>`)}</select></label>
        <label>Width <input type="range" min="480" max="1200" value=${c} onInput=${(x)=>_(Number(x.target.value))} /> ${c}px</label>
        <label>Height <input type="range" min="420" max="900" value=${u} onInput=${(x)=>f(Number(x.target.value))} /> ${u}px</label>
        <button type="button" onClick=${h}>${o?"Mock data":"Real endpoints"}</button>
        <button type="button" onClick=${()=>v((x)=>x+1)}>Remount</button>
        <span class="settings-fixture-note">Add-on panes are registered in scrambled order for nav ordering tests.</span>
      </div>
      <div class="settings-fixture-canvas" style=${`--fixture-width:${c}px;--fixture-height:${u}px;`}>
        <${Dr} key=${g} onClose=${()=>{}} />
      </div>
    </div>
  `}function _0(){ao(),r0(),i0();let n=new URLSearchParams(window.location.search);pu(n.get("section")||"general");let r=document.getElementById("settings-widget-fixture-root")||document.body.appendChild(document.createElement("div"));r.id="settings-widget-fixture-root",qn(l`<${c0} />`,r),window.piclawWidget?.ready?.({title:"Settings fixture",mockMode:Sn})}_0();

//# debugId=5FC2C24DF33C28D964756E2164756E21
//# sourceMappingURL=settings-widget-fixture.bundle.js.map
