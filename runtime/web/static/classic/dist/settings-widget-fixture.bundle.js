var yu=Object.defineProperty;var hu=(n)=>n;function xu(n,r){this[n]=hu.bind(null,r)}var _n=(n,r)=>{for(var i in r)yu(n,i,{get:r[i],enumerable:!0,configurable:!0,set:xu.bind(r,i)})};var Y=(n,r)=>()=>(n&&(r=n(n=0)),r);var Lu={};_n(Lu,{useState:()=>w,useRef:()=>Z,useReducer:()=>B_,useMemo:()=>D,useLayoutEffect:()=>Br,useImperativeHandle:()=>Wu,useErrorBoundary:()=>Tu,useEffect:()=>X,useDebugValue:()=>Ru,useContext:()=>ju,useCallback:()=>T,render:()=>Qn,html:()=>l,h:()=>ar,createContext:()=>ku,Component:()=>an});function vn(n,r){for(var i in r)n[i]=r[i];return n}function mr(n){n&&n.parentNode&&n.parentNode.removeChild(n)}function ar(n,r,i){var _,c,u,f={};for(u in r)u=="key"?_=r[u]:u=="ref"?c=r[u]:f[u]=r[u];if(arguments.length>2&&(f.children=arguments.length>3?Kr.call(arguments,2):i),typeof n=="function"&&n.defaultProps!=null)for(u in n.defaultProps)f[u]===void 0&&(f[u]=n.defaultProps[u]);return hr(n,f,_,c,null)}function hr(n,r,i,_,c){var u={type:n,props:r,key:i,ref:_,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:c==null?++$_:c,__i:-1,__u:0};return c==null&&E.vnode!=null&&E.vnode(u),u}function Fr(n){return n.children}function an(n,r){this.props=n,this.context=r}function Pn(n,r){if(r==null)return n.__?Pn(n.__,n.__i+1):null;for(var i;r<n.__k.length;r++)if((i=n.__k[r])!=null&&i.__e!=null)return i.__e;return typeof n.type=="function"?Pn(n):null}function bu(n){if(n.__P&&n.__d){var r=n.__v,i=r.__e,_=[],c=[],u=vn({},r);u.__v=r.__v+1,E.vnode&&E.vnode(u),ni(n.__P,u,r,n.__n,n.__P.namespaceURI,32&r.__u?[i]:null,_,i==null?Pn(r):i,!!(32&r.__u),c),u.__v=r.__v,u.__.__k[u.__i]=u,b_(_,u,c),r.__e=r.__=null,u.__e!=i&&x_(u)}}function x_(n){if((n=n.__)!=null&&n.__c!=null)return n.__e=n.__c.base=null,n.__k.some(function(r){if(r!=null&&r.__e!=null)return n.__e=n.__c.base=r.__e}),x_(n)}function Er(n){(!n.__d&&(n.__d=!0)&&Bn.push(n)&&!br.__r++||ai!=E.debounceRendering)&&((ai=E.debounceRendering)||w_)(br)}function br(){try{for(var n,r=1;Bn.length;)Bn.length>r&&Bn.sort(t_),n=Bn.shift(),r=Bn.length,bu(n)}finally{Bn.length=br.__r=0}}function v_(n,r,i,_,c,u,f,o,s,$,p){var g,b,x,v,F,y,K,W=_&&_.__k||pr,L=r.length;for(s=Ku(i,r,W,s,L),g=0;g<L;g++)(x=i.__k[g])!=null&&(b=x.__i!=-1&&W[x.__i]||vr,x.__i=g,y=ni(n,x,b,c,u,f,o,s,$,p),v=x.__e,x.ref&&b.ref!=x.ref&&(b.ref&&ri(b.ref,null,x),p.push(x.ref,x.__c||v,x)),F==null&&v!=null&&(F=v),(K=!!(4&x.__u))||b.__k===x.__k?(s=p_(x,s,n,K),K&&b.__e&&(b.__e=null)):typeof x.type=="function"&&y!==void 0?s=y:v&&(s=v.nextSibling),x.__u&=-7);return i.__e=F,s}function Ku(n,r,i,_,c){var u,f,o,s,$,p=i.length,g=p,b=0;for(n.__k=Array(c),u=0;u<c;u++)(f=r[u])!=null&&typeof f!="boolean"&&typeof f!="function"?(typeof f=="string"||typeof f=="number"||typeof f=="bigint"||f.constructor==String?f=n.__k[u]=hr(null,f,null,null,null):zr(f)?f=n.__k[u]=hr(Fr,{children:f},null,null,null):f.constructor===void 0&&f.__b>0?f=n.__k[u]=hr(f.type,f.props,f.key,f.ref?f.ref:null,f.__v):n.__k[u]=f,s=u+b,f.__=n,f.__b=n.__b+1,o=null,($=f.__i=zu(f,i,s,g))!=-1&&(g--,(o=i[$])&&(o.__u|=2)),o==null||o.__v==null?($==-1&&(c>p?b--:c<p&&b++),typeof f.type!="function"&&(f.__u|=4)):$!=s&&($==s-1?b--:$==s+1?b++:($>s?b--:b++,f.__u|=4))):n.__k[u]=null;if(g)for(u=0;u<p;u++)(o=i[u])!=null&&(2&o.__u)==0&&(o.__e==_&&(_=Pn(o)),z_(o,o));return _}function p_(n,r,i,_){var c,u;if(typeof n.type=="function"){for(c=n.__k,u=0;c&&u<c.length;u++)c[u]&&(c[u].__=n,r=p_(c[u],r,i,_));return r}n.__e!=r&&(_&&(r&&n.type&&!r.parentNode&&(r=Pn(n)),i.insertBefore(n.__e,r||null)),r=n.__e);do r=r&&r.nextSibling;while(r!=null&&r.nodeType==8);return r}function zu(n,r,i,_){var c,u,f,o=n.key,s=n.type,$=r[i],p=$!=null&&(2&$.__u)==0;if($===null&&o==null||p&&o==$.key&&s==$.type)return i;if(_>(p?1:0)){for(c=i-1,u=i+1;c>=0||u<r.length;)if(($=r[f=c>=0?c--:u++])!=null&&(2&$.__u)==0&&o==$.key&&s==$.type)return f}return-1}function n_(n,r,i){r[0]=="-"?n.setProperty(r,i==null?"":i):n[r]=i==null?"":typeof i!="number"||pu.test(r)?i:i+"px"}function tr(n,r,i,_,c){var u,f;n:if(r=="style")if(typeof i=="string")n.style.cssText=i;else{if(typeof _=="string"&&(n.style.cssText=_=""),_)for(r in _)i&&r in i||n_(n.style,r,"");if(i)for(r in i)_&&i[r]==_[r]||n_(n.style,r,i[r])}else if(r[0]=="o"&&r[1]=="n")u=r!=(r=r.replace(y_,"$1")),f=r.toLowerCase(),r=f in n||r=="onFocusOut"||r=="onFocusIn"?f.slice(2):r.slice(2),n.l||(n.l={}),n.l[r+u]=i,i?_?i[mn]=_[mn]:(i[mn]=er,n.addEventListener(r,u?Jr:Or,u)):n.removeEventListener(r,u?Jr:Or,u);else{if(c=="http://www.w3.org/2000/svg")r=r.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(r!="width"&&r!="height"&&r!="href"&&r!="list"&&r!="form"&&r!="tabIndex"&&r!="download"&&r!="rowSpan"&&r!="colSpan"&&r!="role"&&r!="popover"&&r in n)try{n[r]=i==null?"":i;break n}catch(o){}typeof i=="function"||(i==null||i===!1&&r[4]!="-"?n.removeAttribute(r):n.setAttribute(r,r=="popover"&&i==1?"":i))}}function r_(n){return function(r){if(this.l){var i=this.l[r.type+n];if(r[yr]==null)r[yr]=er++;else if(r[yr]<i[mn])return;return i(E.event?E.event(r):r)}}}function ni(n,r,i,_,c,u,f,o,s,$){var p,g,b,x,v,F,y,K,W,L,B,U,z,j,Q,t=r.type;if(r.constructor!==void 0)return null;128&i.__u&&(s=!!(32&i.__u),u=[o=r.__e=i.__e]),(p=E.__b)&&p(r);n:if(typeof t=="function")try{if(K=r.props,W=t.prototype&&t.prototype.render,L=(p=t.contextType)&&_[p.__c],B=p?L?L.props.value:p.__:_,i.__c?y=(g=r.__c=i.__c).__=g.__E:(W?r.__c=g=new t(K,B):(r.__c=g=new an(K,B),g.constructor=t,g.render=Bu),L&&L.sub(g),g.state||(g.state={}),g.__n=_,b=g.__d=!0,g.__h=[],g._sb=[]),W&&g.__s==null&&(g.__s=g.state),W&&t.getDerivedStateFromProps!=null&&(g.__s==g.state&&(g.__s=vn({},g.__s)),vn(g.__s,t.getDerivedStateFromProps(K,g.__s))),x=g.props,v=g.state,g.__v=r,b)W&&t.getDerivedStateFromProps==null&&g.componentWillMount!=null&&g.componentWillMount(),W&&g.componentDidMount!=null&&g.__h.push(g.componentDidMount);else{if(W&&t.getDerivedStateFromProps==null&&K!==x&&g.componentWillReceiveProps!=null&&g.componentWillReceiveProps(K,B),r.__v==i.__v||!g.__e&&g.shouldComponentUpdate!=null&&g.shouldComponentUpdate(K,g.__s,B)===!1){r.__v!=i.__v&&(g.props=K,g.state=g.__s,g.__d=!1),r.__e=i.__e,r.__k=i.__k,r.__k.some(function(G){G&&(G.__=r)}),pr.push.apply(g.__h,g._sb),g._sb=[],g.__h.length&&f.push(g);break n}g.componentWillUpdate!=null&&g.componentWillUpdate(K,g.__s,B),W&&g.componentDidUpdate!=null&&g.__h.push(function(){g.componentDidUpdate(x,v,F)})}if(g.context=B,g.props=K,g.__P=n,g.__e=!1,U=E.__r,z=0,W)g.state=g.__s,g.__d=!1,U&&U(r),p=g.render(g.props,g.state,g.context),pr.push.apply(g.__h,g._sb),g._sb=[];else do g.__d=!1,U&&U(r),p=g.render(g.props,g.state,g.context),g.state=g.__s;while(g.__d&&++z<25);g.state=g.__s,g.getChildContext!=null&&(_=vn(vn({},_),g.getChildContext())),W&&!b&&g.getSnapshotBeforeUpdate!=null&&(F=g.getSnapshotBeforeUpdate(x,v)),j=p!=null&&p.type===Fr&&p.key==null?K_(p.props.children):p,o=v_(n,zr(j)?j:[j],r,i,_,c,u,f,o,s,$),g.base=r.__e,r.__u&=-161,g.__h.length&&f.push(g),y&&(g.__E=g.__=null)}catch(G){if(r.__v=null,s||u!=null)if(G.then){for(r.__u|=s?160:128;o&&o.nodeType==8&&o.nextSibling;)o=o.nextSibling;u[u.indexOf(o)]=null,r.__e=o}else{for(Q=u.length;Q--;)mr(u[Q]);dr(r)}else r.__e=i.__e,r.__k=i.__k,G.then||dr(r);E.__e(G,r,i)}else u==null&&r.__v==i.__v?(r.__k=i.__k,r.__e=i.__e):o=r.__e=Fu(i.__e,r,i,_,c,u,f,s,$);return(p=E.diffed)&&p(r),128&r.__u?void 0:o}function dr(n){n&&(n.__c&&(n.__c.__e=!0),n.__k&&n.__k.some(dr))}function b_(n,r,i){for(var _=0;_<i.length;_++)ri(i[_],i[++_],i[++_]);E.__c&&E.__c(r,n),n.some(function(c){try{n=c.__h,c.__h=[],n.some(function(u){u.call(c)})}catch(u){E.__e(u,c.__v)}})}function K_(n){return typeof n!="object"||n==null||n.__b>0?n:zr(n)?n.map(K_):vn({},n)}function Fu(n,r,i,_,c,u,f,o,s){var $,p,g,b,x,v,F,y=i.props||vr,K=r.props,W=r.type;if(W=="svg"?c="http://www.w3.org/2000/svg":W=="math"?c="http://www.w3.org/1998/Math/MathML":c||(c="http://www.w3.org/1999/xhtml"),u!=null){for($=0;$<u.length;$++)if((x=u[$])&&"setAttribute"in x==!!W&&(W?x.localName==W:x.nodeType==3)){n=x,u[$]=null;break}}if(n==null){if(W==null)return document.createTextNode(K);n=document.createElementNS(c,W,K.is&&K),o&&(E.__m&&E.__m(r,u),o=!1),u=null}if(W==null)y===K||o&&n.data==K||(n.data=K);else{if(u=u&&Kr.call(n.childNodes),!o&&u!=null)for(y={},$=0;$<n.attributes.length;$++)y[(x=n.attributes[$]).name]=x.value;for($ in y)x=y[$],$=="dangerouslySetInnerHTML"?g=x:$=="children"||($ in K)||$=="value"&&("defaultValue"in K)||$=="checked"&&("defaultChecked"in K)||tr(n,$,null,x,c);for($ in K)x=K[$],$=="children"?b=x:$=="dangerouslySetInnerHTML"?p=x:$=="value"?v=x:$=="checked"?F=x:o&&typeof x!="function"||y[$]===x||tr(n,$,x,y[$],c);if(p)o||g&&(p.__html==g.__html||p.__html==n.innerHTML)||(n.innerHTML=p.__html),r.__k=[];else if(g&&(n.innerHTML=""),v_(r.type=="template"?n.content:n,zr(b)?b:[b],r,i,_,W=="foreignObject"?"http://www.w3.org/1999/xhtml":c,u,f,u?u[0]:i.__k&&Pn(i,0),o,s),u!=null)for($=u.length;$--;)mr(u[$]);o||($="value",W=="progress"&&v==null?n.removeAttribute("value"):v!=null&&(v!==n[$]||W=="progress"&&!v||W=="option"&&v!=y[$])&&tr(n,$,v,y[$],c),$="checked",F!=null&&F!=n[$]&&tr(n,$,F,y[$],c))}return n}function ri(n,r,i){try{if(typeof n=="function"){var _=typeof n.__u=="function";_&&n.__u(),_&&r==null||(n.__u=n(r))}else n.current=r}catch(c){E.__e(c,i)}}function z_(n,r,i){var _,c;if(E.unmount&&E.unmount(n),(_=n.ref)&&(_.current&&_.current!=n.__e||ri(_,null,r)),(_=n.__c)!=null){if(_.componentWillUnmount)try{_.componentWillUnmount()}catch(u){E.__e(u,r)}_.base=_.__P=null}if(_=n.__k)for(c=0;c<_.length;c++)_[c]&&z_(_[c],r,i||typeof n.type!="function");i||mr(n.__e),n.__c=n.__=n.__e=void 0}function Bu(n,r,i){return this.constructor(n,i)}function Qn(n,r,i){var _,c,u,f;r==document&&(r=document.documentElement),E.__&&E.__(n,r),c=(_=typeof i=="function")?null:i&&i.__k||r.__k,u=[],f=[],ni(r,n=(!_&&i||r).__k=ar(Fr,null,[n]),c||vr,vr,r.namespaceURI,!_&&i?[i]:c?null:r.firstChild?Kr.call(r.childNodes):null,u,!_&&i?i:c?c.__e:r.firstChild,_,f),b_(u,n,f)}function ku(n){function r(i){var _,c;return this.getChildContext||(_=new Set,(c={})[r.__c]=this,this.getChildContext=function(){return c},this.componentWillUnmount=function(){_=null},this.shouldComponentUpdate=function(u){this.props.value!=u.value&&_.forEach(function(f){f.__e=!0,Er(f)})},this.sub=function(u){_.add(u);var f=u.componentWillUnmount;u.componentWillUnmount=function(){_&&_.delete(u),f&&f.call(u)}}),i.children}return r.__c="__cC"+h_++,r.__=n,r.Provider=r.__l=(r.Consumer=function(i,_){return i.children(_)}).contextType=r,r}function An(n,r){S.__h&&S.__h(J,n,Xn||r),Xn=0;var i=J.__H||(J.__H={__:[],__h:[]});return n>=i.__.length&&i.__.push({}),i.__[n]}function w(n){return Xn=1,B_(k_,n)}function B_(n,r,i){var _=An(kn++,2);if(_.t=n,!_.__c&&(_.__=[i?i(r):k_(void 0,r),function(o){var s=_.__N?_.__N[0]:_.__[0],$=_.t(s,o);s!==$&&(_.__N=[$,_.__[1]],_.__c.setState({}))}],_.__c=J,!J.__f)){var c=function(o,s,$){if(!_.__c.__H)return!0;var p=_.__c.__H.__.filter(function(b){return b.__c});if(p.every(function(b){return!b.__N}))return!u||u.call(this,o,s,$);var g=_.__c.props!==o;return p.some(function(b){if(b.__N){var x=b.__[0];b.__=b.__N,b.__N=void 0,x!==b.__[0]&&(g=!0)}}),u&&u.call(this,o,s,$)||g};J.__f=!0;var{shouldComponentUpdate:u,componentWillUpdate:f}=J;J.componentWillUpdate=function(o,s,$){if(this.__e){var p=u;u=void 0,c(o,s,$),u=p}f&&f.call(this,o,s,$)},J.shouldComponentUpdate=c}return _.__N||_.__}function X(n,r){var i=An(kn++,3);!S.__s&&ii(i.__H,r)&&(i.__=n,i.u=r,J.__H.__h.push(i))}function Br(n,r){var i=An(kn++,4);!S.__s&&ii(i.__H,r)&&(i.__=n,i.u=r,J.__h.push(i))}function Z(n){return Xn=5,D(function(){return{current:n}},[])}function Wu(n,r,i){Xn=6,Br(function(){if(typeof n=="function"){var _=n(r());return function(){n(null),_&&typeof _=="function"&&_()}}if(n)return n.current=r(),function(){return n.current=null}},i==null?i:i.concat(n))}function D(n,r){var i=An(kn++,7);return ii(i.__H,r)&&(i.__=n(),i.__H=r,i.__h=n),i.__}function T(n,r){return Xn=8,D(function(){return n},r)}function ju(n){var r=J.context[n.__c],i=An(kn++,9);return i.c=n,r?(i.__==null&&(i.__=!0,r.sub(J)),r.props.value):n.__}function Ru(n,r){S.useDebugValue&&S.useDebugValue(r?r(n):n)}function Tu(n){var r=An(kn++,10),i=w();return r.__=n,J.componentDidCatch||(J.componentDidCatch=function(_,c){r.__&&r.__(_,c),i[1](_)}),[i[0],function(){i[1](void 0)}]}function Uu(){for(var n;n=F_.shift();){var r=n.__H;if(n.__P&&r)try{r.__h.some(xr),r.__h.some(Sr),r.__h=[]}catch(i){r.__h=[],S.__e(i,n.__v)}}}function Gu(n){var r,i=function(){clearTimeout(_),s_&&cancelAnimationFrame(r),setTimeout(n)},_=setTimeout(i,35);s_&&(r=requestAnimationFrame(i))}function xr(n){var r=J,i=n.__c;typeof i=="function"&&(n.__c=void 0,i()),J=r}function Sr(n){var r=J;n.__c=n.__(),J=r}function ii(n,r){return!n||n.length!==r.length||r.some(function(i,_){return i!==n[_]})}function k_(n,r){return typeof r=="function"?r(n):r}function Hu(n){var r=g_.get(this);return r||(r=new Map,g_.set(this,r)),(r=W_(this,r.get(n)||(r.set(n,r=function(i){for(var _,c,u=1,f="",o="",s=[0],$=function(b){u===1&&(b||(f=f.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?s.push(0,b,f):u===3&&(b||f)?(s.push(3,b,f),u=2):u===2&&f==="..."&&b?s.push(4,b,0):u===2&&f&&!b?s.push(5,0,!0,f):u>=5&&((f||!b&&u===5)&&(s.push(u,0,f,c),u=6),b&&(s.push(u,b,0,c),u=6)),f=""},p=0;p<i.length;p++){p&&(u===1&&$(),$(p));for(var g=0;g<i[p].length;g++)_=i[p][g],u===1?_==="<"?($(),s=[s],u=3):f+=_:u===4?f==="--"&&_===">"?(u=1,f=""):f=_+f[0]:o?_===o?o="":f+=_:_==='"'||_==="'"?o=_:_===">"?($(),u=1):u&&(_==="="?(u=5,c=f,f=""):_==="/"&&(u<5||i[p][g+1]===">")?($(),u===3&&(s=s[0]),u=s,(s=s[0]).push(2,0,u),u=0):_===" "||_==="\t"||_===`
`||_==="\r"?($(),u=2):f+=_),u===3&&f==="!--"&&(u=4,s=s[0])}return $(),s}(n)),r),arguments,[])).length>1?r:r[0]}var Kr,E,$_,vu,Bn,ai,w_,t_,Yr,yr,mn,y_,er,Or,Jr,h_,vr,pr,pu,zr,kn,J,Cr,i_,Xn=0,F_,S,__,c_,u_,f_,l_,o_,s_,W_=function(n,r,i,_){var c;r[0]=0;for(var u=1;u<r.length;u++){var f=r[u++],o=r[u]?(r[0]|=f?1:2,i[r[u++]]):r[++u];f===3?_[0]=o:f===4?_[1]=Object.assign(_[1]||{},o):f===5?(_[1]=_[1]||{})[r[++u]]=o:f===6?_[1][r[++u]]+=o+"":f?(c=n.apply(o,W_(n,o,i,["",null])),_.push(c),o[0]?r[0]|=2:(r[u-2]=0,r[u]=c)):_.push(o)}return _},g_,l;var m=Y(()=>{vr={},pr=[],pu=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,zr=Array.isArray;Kr=pr.slice,E={__e:function(n,r,i,_){for(var c,u,f;r=r.__;)if((c=r.__c)&&!c.__)try{if((u=c.constructor)&&u.getDerivedStateFromError!=null&&(c.setState(u.getDerivedStateFromError(n)),f=c.__d),c.componentDidCatch!=null&&(c.componentDidCatch(n,_||{}),f=c.__d),f)return c.__E=c}catch(o){n=o}throw n}},$_=0,vu=function(n){return n!=null&&n.constructor===void 0},an.prototype.setState=function(n,r){var i;i=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=vn({},this.state),typeof n=="function"&&(n=n(vn({},i),this.props)),n&&vn(i,n),n!=null&&this.__v&&(r&&this._sb.push(r),Er(this))},an.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),Er(this))},an.prototype.render=Fr,Bn=[],w_=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,t_=function(n,r){return n.__v.__b-r.__v.__b},br.__r=0,Yr=Math.random().toString(8),yr="__d"+Yr,mn="__a"+Yr,y_=/(PointerCapture)$|Capture$/i,er=0,Or=r_(!1),Jr=r_(!0),h_=0;F_=[],S=E,__=S.__b,c_=S.__r,u_=S.diffed,f_=S.__c,l_=S.unmount,o_=S.__;S.__b=function(n){J=null,__&&__(n)},S.__=function(n,r){n&&r.__k&&r.__k.__m&&(n.__m=r.__k.__m),o_&&o_(n,r)},S.__r=function(n){c_&&c_(n),kn=0;var r=(J=n.__c).__H;r&&(Cr===J?(r.__h=[],J.__h=[],r.__.some(function(i){i.__N&&(i.__=i.__N),i.u=i.__N=void 0})):(r.__h.some(xr),r.__h.some(Sr),r.__h=[],kn=0)),Cr=J},S.diffed=function(n){u_&&u_(n);var r=n.__c;r&&r.__H&&(r.__H.__h.length&&(F_.push(r)!==1&&i_===S.requestAnimationFrame||((i_=S.requestAnimationFrame)||Gu)(Uu)),r.__H.__.some(function(i){i.u&&(i.__H=i.u),i.u=void 0})),Cr=J=null},S.__c=function(n,r){r.some(function(i){try{i.__h.some(xr),i.__h=i.__h.filter(function(_){return!_.__||Sr(_)})}catch(_){r.some(function(c){c.__h&&(c.__h=[])}),r=[],S.__e(_,i.__v)}}),f_&&f_(n,r)},S.unmount=function(n){l_&&l_(n);var r,i=n.__c;i&&i.__H&&(i.__H.__.some(function(_){try{xr(_)}catch(c){r=c}}),i.__H=void 0,r&&S.__e(r,i.__v))};s_=typeof requestAnimationFrame=="function";g_=new Map;l=Hu.bind(ar)});function j_({children:n,className:r=""}){let[i,_]=w(null);return X(()=>{if(typeof document>"u")return;let c=document.createElement("div");return c.className=r||"",document.body.appendChild(c),_(c),()=>{try{Qn(null,c)}finally{c.remove()}}},[]),X(()=>{if(!i)return;i.className=r||"";return},[r,i]),Br(()=>{if(!i)return;Qn(n,i);return},[n,i]),null}var R_=Y(()=>{m()});function _i(n,r){let i=String(n.label||"").localeCompare(String(r.label||""),void 0,{sensitivity:"base"});if(i!==0)return i;return String(n.id||"").localeCompare(String(r.id||""),void 0,{sensitivity:"base"})}function Mn(n){let r=Rn.findIndex((i)=>i.id===n.id);if(r>=0)Rn[r]=n;else Rn.push(n);Rn.sort(_i)}function a0(n){let r=Rn.findIndex((i)=>i.id===n);if(r>=0)Rn.splice(r,1)}function T_(){return[...Rn]}function no(){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent("piclaw:settings-panes-changed"))}var Rn;var nr=Y(()=>{Rn=[]});function kr(n){let r=typeof n==="string"?n.trim():"";return r?r:null}function U_(n={}){if(typeof window>"u")return;let r=kr(n.section);try{if(window.__piclawSettingsOpenRequested=!0,r)window.__piclawSettingsRequestedSection=r;else delete window.__piclawSettingsRequestedSection}catch(i){console.debug("[settings-dialog-events] failed to record open request flags",i)}window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:r?{section:r}:void 0}))}function ci(){if(typeof window>"u")return null;return kr(window.__piclawSettingsRequestedSection)}function G_(){if(typeof window>"u")return{open:!1,section:null};let n=Boolean(window.__piclawSettingsOpenRequested),r=ci();try{window.__piclawSettingsOpenRequested=!1,delete window.__piclawSettingsRequestedSection}catch(i){console.debug("[settings-dialog-events] failed to clear open request flags",i)}return{open:n,section:r}}function L_(n=typeof window<"u"?window:null){return n||null}function Wr(){if(typeof performance<"u"&&typeof performance.now==="function")return performance.now();return Date.now()}function cr(n,r){return`${n}:${r}`}function N_(n){return`${n}-${Math.random().toString(36).slice(2,10)}-${Date.now().toString(36)}`}function V_(n,r){if(n.length<=r)return;n.splice(0,n.length-r)}function Tn(n){if(!n||typeof n!=="object")return null;return{...n}}function Hn(n){if(!n)return null;return Un.find((r)=>r.id===n)||null}function ui(n,r){if(typeof performance>"u"||typeof performance.mark!=="function")return;try{performance.mark(`piclaw:${n}:${r}`)}catch(i){console.debug("[app-perf] Ignoring performance.mark failure.",i,{traceId:n,phase:r})}}function P_(n){if(typeof performance>"u"||typeof performance.clearMarks!=="function")return;try{performance.clearMarks(`piclaw:${n}:start`);let r=Hn(n);if(!r)return;for(let i of r.phases)performance.clearMarks(`piclaw:${n}:${i.phase}`)}catch(r){console.debug("[app-perf] Ignoring performance.clearMarks failure.",r,{traceId:n})}}function H_(n,r,i){let _=Gn.get(cr(n,r));if(_&&Hn(_)?.status==="active")_r(_,"cancelled","superseded",{replacementType:n,replacementChatJid:r});let c=N_(n),u={id:c,type:n,chatJid:r,startedAt:Wr(),detail:Tn(i),phases:[],status:"active"};return Un.push(u),V_(Un,100),Gn.set(cr(n,r),c),ui(c,"start"),c}function _r(n,r,i,_,c){let u=Hn(n);if(!u||u.status!=="active")return;if(i)u.phases.push({phase:i,at:Wr(),detail:Tn(_)}),ui(u.id,i);if(u.status=r,u.completedAt=Wr(),u.durationMs=u.completedAt-u.startedAt,c!==void 0)u.error=c instanceof Error?c.message:String(c);let f=cr(u.type,u.chatJid);if(Gn.get(f)===u.id)Gn.delete(f);P_(u.id)}function Nu(n=L_()){let r=n?.__PICLAW_PERF__;if(r)return r;if(n)n.__PICLAW_PERF__=jr;return jr}function qn(n=L_()){return Nu(n)}function _o(n,r,i){return qn().ensureTrace(n,r,i)}function co(n,r){return qn().getActiveTraceId(n,r)}function uo(n,r,i){qn().markTrace(n,r,i)}function fo(n,r,i="settled",_){let c=Hn(n);if(!c||c.status!=="active")return!1;let u=new Set(c.phases.map((f)=>f.phase));if(!r.every((f)=>u.has(f)))return!1;return _r(n,"completed",i,_),!0}function lo(n,r,i="failed",_){qn().failTrace(n,r,i,_)}function oo(n,r="cancelled",i){qn().cancelTrace(n,r,i)}function fi(n){return qn().recordRequest(n)}var Un,ir,Gn,jr;var X_=Y(()=>{Un=[],ir=[],Gn=new Map;jr={startTrace(n,r,i){return H_(n,r,i)},ensureTrace(n,r,i){let _=Gn.get(cr(n,r));if(_&&Hn(_)?.status==="active")return _;return H_(n,r,i)},getActiveTraceId(n,r){let i=Gn.get(cr(n,r));return i&&Hn(i)?.status==="active"?i:null},markTrace(n,r,i){let _=Hn(n);if(!_||_.status!=="active")return;_.phases.push({phase:r,at:Wr(),detail:Tn(i)}),ui(_.id,r)},completeTrace(n,r="settled",i){_r(n,"completed",r,i)},failTrace(n,r,i="failed",_){_r(n,"failed",i,_,r)},cancelTrace(n,r="cancelled",i){_r(n,"cancelled",r,i)},recordRequest(n){let r=N_("req");return ir.push({...n,id:r,detail:Tn(n.detail)}),V_(ir,300),r},getTraces(){return Un.map((n)=>({...n,detail:Tn(n.detail),phases:n.phases.map((r)=>({...r,detail:Tn(r.detail)}))}))},getRequests(){return ir.map((n)=>({...n,detail:Tn(n.detail)}))},clear(){Un.forEach((n)=>P_(n.id)),Un.splice(0,Un.length),ir.splice(0,ir.length),Gn.clear()},printSummary(){let n={traces:jr.getTraces(),requests:jr.getRequests()};return console.table(n.traces.map((r)=>({id:r.id,type:r.type,chatJid:r.chatJid,status:r.status,durationMs:Number(r.durationMs||0).toFixed(1),lastPhase:r.phases[r.phases.length-1]?.phase||"start"}))),n}}});function Dn(n){let r=Number(n||0);return Number.isFinite(r)&&r>0?r:null}function Vu(n){try{return Boolean(n?.matchMedia?.("(pointer: coarse)")?.matches)}catch{return!1}}function Pu(n){let r=String(n?.navigator?.userAgent||"");return/Android|webOS|iPhone|iPod|Mobile|Windows Phone/i.test(r)}function Q_(n){let r=String(n?.navigator?.userAgent||"");return/iPad|Tablet|PlayBook|Silk/i.test(r)}function A_(n=typeof window<"u"?window:null){let r=Dn(n?.innerWidth)??Dn(n?.screen?.availWidth)??Dn(n?.screen?.width)??0,i=Dn(n?.innerHeight)??Dn(n?.screen?.availHeight)??Dn(n?.screen?.height)??0,_=r&&i?Math.min(r,i):r||i,c=r&&i?Math.max(r,i):r||i,u=Vu(n),f=Number(n?.navigator?.maxTouchPoints||0),o=u||f>1;if(_>0&&_<=640)return"mobile";if(Pu(n)&&!Q_(n))return"mobile";if(Q_(n))return"tablet";if(o&&_>0&&_<=1100)return"tablet";if(c>0&&c<=1180&&_>0&&_<=900)return"tablet";return"desktop"}var ef={};_n(ef,{uploadWorkspaceFile:()=>Zf,uploadMedia:()=>vf,updateWorkspaceFile:()=>Pf,updateScheduledTask:()=>si,submitAdaptiveCardAction:()=>bf,streamSidePrompt:()=>Kf,stopSessionRecording:()=>wi,stopAutoresearch:()=>gf,steerAgentQueueItem:()=>yf,startSessionRecording:()=>$i,setWorkspaceVisibility:()=>Jf,setAgentThoughtVisibility:()=>Bf,sessionRecordingPlaybackUrl:()=>yi,sessionRecordingExportUrl:()=>ur,sendPeerAgentMessage:()=>rf,sendAgentMessage:()=>pn,searchPosts:()=>Mu,saveWorkspaceSettings:()=>Ki,saveWebPushSubscription:()=>cf,saveUiState:()=>xi,saveQuickActionsSettings:()=>bi,savePostAnnotations:()=>Sf,saveEnvironmentOverride:()=>Tr,restoreChatBranch:()=>nf,respondToAgentRequest:()=>pf,reorderAgentQueueItem:()=>hf,renameWorkspaceFile:()=>Yf,renameChatJid:()=>au,renameChatBranch:()=>du,removeAgentQueueItem:()=>tf,reindexWorkspace:()=>Lf,purgeChatBranch:()=>mu,pruneChatBranch:()=>eu,previewSessionRecordingRedaction:()=>hi,moveWorkspaceEntry:()=>Cf,mergeChatBranchIntoParent:()=>Su,getWorkspaceTree:()=>Uf,getWorkspaceRawUrl:()=>q_,getWorkspaceIndexStatus:()=>Hf,getWorkspaceFileStat:()=>Vf,getWorkspaceFileDownloadUrl:()=>Ef,getWorkspaceFile:()=>Nf,getWorkspaceDownloadUrl:()=>df,getWorkspaceBranch:()=>Gf,getWebPushPublicKey:()=>_f,getTimeline:()=>Qu,getThumbnailUrl:()=>Wf,getThread:()=>qu,getSystemMetrics:()=>Du,getSessionRecordings:()=>gi,getSessionRecording:()=>Rr,getScheduledTasks:()=>oi,getQuickActionsSettings:()=>pi,getPostsByHashtag:()=>Au,getMediaUrl:()=>kf,getMediaText:()=>Rf,getMediaInfo:()=>jf,getMediaBlob:()=>Tf,getEnvironmentSettings:()=>zi,getChatBranches:()=>Ou,getAutoresearchStatus:()=>sf,getAgents:()=>ff,getAgentThought:()=>Ff,getAgentStatus:()=>lf,getAgentQueueState:()=>wf,getAgentModels:()=>Fi,getAgentContext:()=>of,getAgentCommands:()=>vi,getActiveChatAgents:()=>Cu,forkChatBranch:()=>Ju,dismissAutoresearch:()=>$f,deleteWorkspaceFile:()=>Of,deleteWebPushSubscription:()=>uf,deleteSessionRecording:()=>ti,deletePost:()=>Yu,createWorkspaceFile:()=>If,createRootChatSession:()=>Eu,createReply:()=>Iu,createPost:()=>Zu,completeInstanceOobe:()=>xf,attachWorkspaceFile:()=>Xf,addToWhitelist:()=>zf,SSEClient:()=>D_});async function P(n,r={}){let i=typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now(),_;try{_=await fetch(nn+n,{...r,headers:{"Content-Type":"application/json",...r.headers}})}catch(u){throw fi({method:String(r.method||"GET").toUpperCase(),url:n,startedAt:i,durationMs:(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-i,ok:!1,detail:{failedBeforeResponse:!0}}),u}let c=(typeof performance<"u"&&typeof performance.now==="function"?performance.now():Date.now())-i;if(fi({method:String(r.method||"GET").toUpperCase(),url:n,startedAt:i,durationMs:c,status:_.status,ok:_.ok,requestId:_.headers?.get?.("x-request-id")||null,serverTiming:_.headers?.get?.("Server-Timing")||null}),!_.ok){let u=await _.json().catch(()=>({error:"Unknown error"}));throw Error(u.error||`HTTP ${_.status}`)}return _.json()}function M_(n){let r=String(n||"").split(`
`),i="message",_=[];for(let u of r)if(u.startsWith("event:"))i=u.slice(6).trim()||"message";else if(u.startsWith("data:"))_.push(u.slice(5).trim());let c=_.join(`
`);if(!c)return null;try{return{event:i,data:JSON.parse(c)}}catch{return{event:i,data:c}}}async function Xu(n,r){if(!n.body)throw Error("Missing event stream body");let i=n.body.getReader(),_=new TextDecoder,c="";while(!0){let{value:f,done:o}=await i.read();if(o)break;c+=_.decode(f,{stream:!0});let s=c.split(`

`);c=s.pop()||"";for(let $ of s){let p=M_($);if(p)r(p.event,p.data)}}c+=_.decode();let u=M_(c);if(u)r(u.event,u.data)}async function Qu(n=10,r=null,i=null){let _=`/timeline?limit=${n}`;if(r)_+=`&before=${r}`;if(i)_+=`&chat_jid=${encodeURIComponent(i)}`;return P(_)}async function Au(n,r=50,i=0,_=null){let c=_?`&chat_jid=${encodeURIComponent(_)}`:"";return P(`/hashtag/${encodeURIComponent(n)}?limit=${r}&offset=${i}${c}`)}async function Mu(n,r=50,i=0,_=null,c="current",u=null,f=null){let o=_?`&chat_jid=${encodeURIComponent(_)}`:"",s=c?`&scope=${encodeURIComponent(c)}`:"",$=u?`&root_chat_jid=${encodeURIComponent(u)}`:"",p=f?.images?"&images=1":"",g=f?.attachments?"&attachments=1":"";return P(`/search?q=${encodeURIComponent(n)}&limit=${r}&offset=${i}${o}${s}${$}${p}${g}`)}async function qu(n,r=null){let i=r?`?chat_jid=${encodeURIComponent(r)}`:"";return P(`/thread/${n}${i}`)}async function Du(){return P("/agent/system-metrics")}async function oi(n={}){let r=new URLSearchParams;if(n?.id)r.set("id",String(n.id));if(n?.chatJid)r.set("chat_jid",String(n.chatJid));if(n?.status&&n.status!=="all")r.set("status",String(n.status));if(n?.limit)r.set("limit",String(n.limit));if(n?.includeRunLogs)r.set("include_run_logs","1");if(n?.runLogLimit)r.set("run_log_limit",String(n.runLogLimit));let i=r.toString()?`?${r.toString()}`:"";return P(`/agent/scheduled-tasks${i}`)}async function si(n,r,i={}){return P("/agent/scheduled-tasks/action",{method:"POST",body:JSON.stringify({action:n,id:r,allow_internal:i?.allowInternal===!0})})}async function gi(){return P("/agent/recordings")}async function Rr(n){return P(`/agent/recordings/${encodeURIComponent(n)}`)}async function $i(n={}){return P("/agent/recordings/start",{method:"POST",body:JSON.stringify(n||{})})}async function wi(n={}){return P("/agent/recordings/stop",{method:"POST",body:JSON.stringify(n||{})})}async function ti(n){return P(`/agent/recordings/${encodeURIComponent(n)}`,{method:"DELETE"})}function ur(n,r="json"){return`/agent/recordings/${encodeURIComponent(n)}/export?format=${encodeURIComponent(r)}`}function yi(n){return`/recordings/playback?id=${encodeURIComponent(n)}`}async function hi(n,r={}){return P("/agent/recordings/redact-preview",{method:"POST",body:JSON.stringify({payload:n,...r})})}async function xi(n){return P("/agent/ui-state",{method:"POST",body:JSON.stringify(n||{})})}async function Zu(n,r=[],i=null){let _=i?`?chat_jid=${encodeURIComponent(i)}`:"";return P(`/post${_}`,{method:"POST",body:JSON.stringify({content:n,media_ids:r})})}async function Iu(n,r,i=[],_=null){let c=_?`?chat_jid=${encodeURIComponent(_)}`:"";return P(`/post/reply${c}`,{method:"POST",body:JSON.stringify({thread_id:n,content:r,media_ids:i})})}async function Yu(n,r=!1,i=null){let _=i?`&chat_jid=${encodeURIComponent(i)}`:"",c=`/post/${n}?cascade=${r?"true":"false"}${_}`;return P(c,{method:"DELETE"})}async function pn(n,r,i=null,_=[],c=null,u=null){let f=u?`?chat_jid=${encodeURIComponent(u)}`:"",o={content:r,thread_id:i,media_ids:_,client_context:{screen_hint:A_()}};if(c==="auto"||c==="queue"||c==="steer")o.mode=c;return P(`/agent/${n}/message${f}`,{method:"POST",body:JSON.stringify(o)})}async function vi(n="web:default"){let r=typeof n==="string"&&n.trim()?n.trim():"web:default";return P(`/agent/commands?chat_jid=${encodeURIComponent(r)}`)}async function pi(){return P("/agent/settings/quick-actions")}async function bi(n){return P("/agent/settings/quick-actions",{method:"POST",body:JSON.stringify(n||{})})}async function Ki(n){return P("/agent/settings/workspace",{method:"POST",body:JSON.stringify(n||{})})}async function zi(){return P("/agent/settings/environment")}async function Tr(n){return P("/agent/settings/environment",{method:"POST",body:JSON.stringify(n||{})})}async function Cu(){return P("/agent/active-chats")}async function Ou(n=null,r={}){let i=new URLSearchParams;if(n)i.set("root_chat_jid",String(n));if(r?.includeArchived)i.set("include_archived","1");let _=i.toString()?`?${i.toString()}`:"";return P(`/agent/branches${_}`)}async function Ju(n,r={}){return P("/agent/branch-fork",{method:"POST",body:JSON.stringify({source_chat_jid:n,...r?.agentName?{agent_name:r.agentName}:{}})})}async function Eu(n){return P("/agent/root-session",{method:"POST",body:JSON.stringify({agent_name:n})})}async function du(n,r={}){return P("/agent/branch-rename",{method:"POST",body:JSON.stringify({chat_jid:n,...r&&Object.prototype.hasOwnProperty.call(r,"agentName")?{agent_name:r.agentName}:{}})})}async function Su(n){return P("/agent/branch-merge-parent",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function eu(n){return P("/agent/branch-prune",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function mu(n){return P("/agent/branch-purge",{method:"POST",body:JSON.stringify({chat_jid:n})})}async function au(n,r){return P("/agent/rename-jid",{method:"POST",body:JSON.stringify({old_jid:n,new_jid:r})})}async function nf(n,r={}){return P("/agent/branch-restore",{method:"POST",body:JSON.stringify({chat_jid:n,...r&&Object.prototype.hasOwnProperty.call(r,"agentName")?{agent_name:r.agentName}:{}})})}async function rf(n,r,i,_="auto",c={}){let u={source_chat_jid:n,content:i,mode:_,...c?.sourceAgentName?{source_agent_name:c.sourceAgentName}:{},...c?.targetBy==="agent_name"?{target_agent_name:r}:{target_chat_jid:r}};return P("/agent/peer-message",{method:"POST",body:JSON.stringify(u)})}async function _f(){return P("/agent/push/vapid-public-key")}async function cf(n,r={}){let i={subscription:n,...r?.deviceId?{device_id:r.deviceId}:{}};return P("/agent/push/subscription",{method:"POST",body:JSON.stringify(i)})}async function uf(n,r={}){let i={subscription:n,...r?.deviceId?{device_id:r.deviceId}:{}};return P("/agent/push/subscription",{method:"DELETE",body:JSON.stringify(i)})}async function ff(){return P("/agent/roster")}async function lf(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return P(`/agent/status${r}`)}async function of(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return P(`/agent/context${r}`)}async function sf(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return P(`/agent/autoresearch/status${r}`)}async function gf(n=null,r={}){return P("/agent/autoresearch/stop",{method:"POST",body:JSON.stringify({chat_jid:n||void 0,generate_report:r?.generateReport!==!1})})}async function $f(n=null){return P("/agent/autoresearch/dismiss",{method:"POST",body:JSON.stringify({chat_jid:n||void 0})})}async function wf(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return P(`/agent/queue-state${r}`)}async function tf(n,r=null){let i=await fetch(nn+"/agent/queue-remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:n,chat_jid:r||void 0})});if(!i.ok){let _=await i.json().catch(()=>({error:"Failed to remove queued item"}));throw Error(_.error||`HTTP ${i.status}`)}return i.json()}async function yf(n,r=null){let i=await fetch(nn+"/agent/queue-steer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({row_id:n,chat_jid:r||void 0})});if(!i.ok){let _=await i.json().catch(()=>({error:"Failed to steer queued item"}));throw Error(_.error||`HTTP ${i.status}`)}return i.json()}async function hf(n,r,i=null){let _=await fetch(nn+"/agent/queue-reorder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from_index:n,to_index:r,chat_jid:i||void 0})});if(!_.ok){let c=await _.json().catch(()=>({error:"Failed to reorder queued item"}));throw Error(c.error||`HTTP ${_.status}`)}return _.json()}async function Fi(n=null){let r=n?`?chat_jid=${encodeURIComponent(n)}`:"";return P(`/agent/models${r}`)}async function xf(n="provider-ready"){return P("/agent/oobe/complete",{method:"POST",body:JSON.stringify({kind:n})})}async function vf(n){let r=new FormData;r.append("file",n);let i=await fetch(nn+"/media/upload",{method:"POST",body:r});if(!i.ok){let _=await i.json().catch(()=>({error:"Upload failed"}));throw Error(_.error||`HTTP ${i.status}`)}return i.json()}async function pf(n,r,i=null){let _=await fetch(nn+"/agent/respond",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request_id:n,outcome:r,chat_jid:i||void 0})});if(!_.ok){let c=await _.json().catch(()=>({error:"Failed to respond"}));throw Error(c.error||`HTTP ${_.status}`)}return _.json()}async function bf(n){let r=await fetch(nn+"/agent/card-action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!r.ok){let i=await r.json().catch(()=>({error:"Adaptive Card action failed"}));throw Error(i.error||`HTTP ${r.status}`)}return r.json()}async function Kf(n,r={}){let i=await fetch(nn+"/agent/side-prompt/stream",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:n,system_prompt:r.systemPrompt||void 0,chat_jid:r.chatJid||void 0}),signal:r.signal});if(!i.ok){let u=await i.json().catch(()=>({error:"Side prompt failed"}));throw Error(u.error||`HTTP ${i.status}`)}let _=null,c=null;if(await Xu(i,(u,f)=>{if(r.onEvent?.(u,f),u==="side_prompt_thinking_delta")r.onThinkingDelta?.(f?.delta||"");else if(u==="side_prompt_text_delta")r.onTextDelta?.(f?.delta||"");else if(u==="side_prompt_done")_=f;else if(u==="side_prompt_error")c=f}),c){let u=Error(c?.error||"Side prompt failed");throw u.payload=c,u}return _}async function zf(n,r){let i=await fetch(nn+"/agent/whitelist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pattern:n,description:r})});if(!i.ok){let _=await i.json().catch(()=>({error:"Failed to add to whitelist"}));throw Error(_.error||`HTTP ${i.status}`)}return i.json()}async function Ff(n,r="thought"){let i=`/agent/thought?turn_id=${encodeURIComponent(n)}&panel=${encodeURIComponent(r)}`;return P(i)}async function Bf(n,r,i){return P("/agent/thought/visibility",{method:"POST",body:JSON.stringify({turn_id:n,panel:r,expanded:Boolean(i)})})}function kf(n){return`${nn}/media/${n}`}function Wf(n){return`${nn}/media/${n}/thumbnail`}async function jf(n){let r=await fetch(`${nn}/media/${n}/info`);if(!r.ok)throw Error("Failed to get media info");return r.json()}async function Rf(n){let r=await fetch(`${nn}/media/${n}`);if(!r.ok)throw Error("Failed to load media text");return r.text()}async function Tf(n){let r=await fetch(`${nn}/media/${n}`);if(!r.ok)throw Error("Failed to load media blob");return r.blob()}async function Uf(n="",r=2,i=!1){let _=`/workspace/tree?path=${encodeURIComponent(n)}&depth=${r}&show_hidden=${i?"1":"0"}`;return P(_)}async function Gf(n=""){let r=`/workspace/branch?path=${encodeURIComponent(n||"")}`;return P(r)}async function Hf(n="all"){let r=`/workspace/index-status?scope=${encodeURIComponent(n||"all")}`;return P(r)}async function Lf(n="all"){return P("/workspace/reindex",{method:"POST",body:JSON.stringify({scope:n})})}async function Nf(n,r=20000,i=null){let _=i?`&mode=${encodeURIComponent(i)}`:"",c=`/workspace/file?path=${encodeURIComponent(n)}&max=${r}${_}`;return P(c)}async function Vf(n){return P(`/workspace/stat?path=${encodeURIComponent(n)}`)}async function Pf(n,r){return P("/workspace/file",{method:"PUT",body:JSON.stringify({path:n,content:r})})}async function Xf(n){return P("/workspace/attach",{method:"POST",body:JSON.stringify({path:n})})}function Af(n,r="",i={}){let _=new URLSearchParams;if(r)_.set("path",r);if(i.overwrite)_.set("overwrite","1");let c=_.toString();return c?`${n}?${c}`:n}function Mf(){if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();return`upload-${Date.now()}-${Math.random().toString(36).slice(2)}`}function qf(n,r,i,_){return new Promise((c,u)=>{let f=new XMLHttpRequest;f.open("POST",nn+r);for(let[o,s]of Object.entries(i||{}))if(s!==void 0&&s!==null)f.setRequestHeader(o,String(s));f.upload.onprogress=(o)=>{if(typeof _==="function")_({loaded:o.lengthComputable?o.loaded:0,total:o.lengthComputable?o.total:n.size,lengthComputable:o.lengthComputable})},f.onload=()=>{try{let o=f.responseText?JSON.parse(f.responseText):{};if(f.status>=200&&f.status<300)c(o);else{let s=Error(o.error||`HTTP ${f.status}`);s.status=f.status,s.code=o.code,u(s)}}catch{let o=Error(`HTTP ${f.status}`);o.status=f.status,u(o)}},f.onerror=()=>u(Error("Upload failed (network error)")),f.ontimeout=()=>u(Error("Upload timed out")),f.send(n)})}async function Df(n,r="",i={}){let _=Mf(),c=Af("/workspace/upload-chunk",r,i),u=Math.max(1,Math.min(li,Number(i.chunkSize)||Qf)),f=Math.max(0,Number(n?.size)||0),o=Math.max(1,Math.ceil(f/u)),s=0,$=null;for(let p=0;p<o;p+=1){let g=p*u,b=Math.min(f,g+u),x=n.slice(g,b),v=x.size;if($=await qf(x,c,{"X-Upload-Id":_,"X-Chunk-Index":p,"X-Chunk-Total":o,"X-File-Name":n?.name||"upload.bin","X-File-Size":f},(F)=>{if(typeof i.onProgress!=="function")return;let y=Math.min(f,s+(F?.loaded||0)),K=f||1;i.onProgress({loaded:y,total:K,percent:Math.round(y/K*100),chunkIndex:p,chunkTotal:o})}),s+=v,typeof i.onProgress==="function"){let F=f||1,y=f?s:F;i.onProgress({loaded:y,total:F,percent:Math.round(y/F*100),chunkIndex:p+1,chunkTotal:o})}}return $}async function Zf(n,r="",i={}){if(n?.size>li){let _=(n.size/1048576).toFixed(0),c=(li/1048576).toFixed(0),u=Error(`File too large (${_} MB). Maximum upload size is ${c} MB.`);throw u.code="file_too_large",u}return await Df(n,r,i)}async function If(n,r,i=""){let _=await fetch(nn+"/workspace/file",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,name:r,content:i})});if(!_.ok){let c=await _.json().catch(()=>({error:"Create failed"})),u=Error(c.error||`HTTP ${_.status}`);throw u.status=_.status,u.code=c.code,u}return _.json()}async function Yf(n,r){let i=await fetch(nn+"/workspace/rename",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,name:r})});if(!i.ok){let _=await i.json().catch(()=>({error:"Rename failed"})),c=Error(_.error||`HTTP ${i.status}`);throw c.status=i.status,c.code=_.code,c}return i.json()}async function Cf(n,r){let i=await fetch(nn+"/workspace/move",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:n,target:r})});if(!i.ok){let _=await i.json().catch(()=>({error:"Move failed"})),c=Error(_.error||`HTTP ${i.status}`);throw c.status=i.status,c.code=_.code,c}return i.json()}async function Of(n){let r=`/workspace/file?path=${encodeURIComponent(n||"")}`;return P(r,{method:"DELETE"})}async function Jf(n,r=!1){return P("/workspace/visibility",{method:"POST",body:JSON.stringify({visible:Boolean(n),show_hidden:Boolean(r)})})}function q_(n,r={}){let i=new URLSearchParams({path:String(n||"")});if(r.download)i.set("download","1");return`${nn}/workspace/raw?${i.toString()}`}function Ef(n){return q_(n,{download:!0})}function df(n,r=!1){let i=`path=${encodeURIComponent(n||"")}&show_hidden=${r?"1":"0"}`;return`${nn}/workspace/download?${i}`}class D_{onEvent;onStatusChange;chatJid;eventSource;reconnectTimeout;reconnectDelay;status;reconnectAttempts;cooldownUntil;connecting;lastActivityAt;staleCheckTimer;staleThresholdMs;constructor(n,r,i={}){this.onEvent=n,this.onStatusChange=r,this.chatJid=typeof i?.chatJid==="string"&&i.chatJid.trim()?i.chatJid.trim():null,this.eventSource=null,this.reconnectTimeout=null,this.reconnectDelay=1000,this.status="disconnected",this.reconnectAttempts=0,this.cooldownUntil=0,this.connecting=!1,this.lastActivityAt=0,this.staleCheckTimer=null,this.staleThresholdMs=70000}markActivity(){this.lastActivityAt=Date.now()}clearStaleMonitor(){if(this.staleCheckTimer)clearInterval(this.staleCheckTimer),this.staleCheckTimer=null}startStaleMonitor(){this.clearStaleMonitor(),this.staleCheckTimer=setInterval(()=>{if(this.status!=="connected")return;if(!this.lastActivityAt)return;if(Date.now()-this.lastActivityAt<=this.staleThresholdMs)return;console.warn("SSE connection went stale; forcing reconnect"),this.forceReconnect()},15000)}forceReconnect(){if(this.connecting=!1,this.eventSource)this.eventSource.close(),this.eventSource=null;this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()}connect(){if(this.connecting)return;if(this.eventSource&&this.status==="connected")return;if(this.connecting=!0,this.eventSource)this.eventSource.close();this.clearStaleMonitor();let n=this.chatJid?`?chat_jid=${encodeURIComponent(this.chatJid)}`:"";this.eventSource=new EventSource(nn+"/sse/stream"+n);let r=(i)=>{this.eventSource.addEventListener(i,(_)=>{this.markActivity(),this.onEvent(i,JSON.parse(_.data))})};this.eventSource.onopen=()=>{this.connecting=!1,this.reconnectDelay=1000,this.reconnectAttempts=0,this.cooldownUntil=0,this.status="connected",this.markActivity(),this.startStaleMonitor(),this.onStatusChange("connected")},this.eventSource.onerror=()=>{this.connecting=!1,this.clearStaleMonitor(),this.status="disconnected",this.onStatusChange("disconnected"),this.reconnectAttempts+=1,this.scheduleReconnect()},this.eventSource.addEventListener("connected",()=>{this.markActivity(),console.log("SSE connected"),this.onEvent("connected",{})}),this.eventSource.addEventListener("heartbeat",()=>{this.markActivity()}),r("new_post"),r("new_reply"),r("agent_response"),r("interaction_updated"),r("interaction_deleted"),r("agent_status"),r("agent_steer_queued"),r("agent_followup_queued"),r("agent_followup_consumed"),r("agent_followup_removed"),r("workspace_update"),r("agent_draft"),r("agent_draft_delta"),r("agent_thought"),r("agent_thought_delta"),r("model_changed"),r("ui_theme"),r("ui_meters"),["extension_ui_request","extension_ui_timeout","extension_ui_notify","extension_ui_status","extension_ui_working","extension_ui_working_indicator","extension_ui_working_visible","extension_ui_widget","extension_ui_title","extension_ui_editor_text","extension_ui_error"].forEach(r)}scheduleReconnect(){if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout);let n=10,r=60000,i=Date.now();if(this.reconnectAttempts>=n)this.cooldownUntil=Math.max(this.cooldownUntil,i+r),this.reconnectAttempts=0;let _=Math.max(this.cooldownUntil-i,0),c=Math.max(this.reconnectDelay,_);this.reconnectTimeout=setTimeout(()=>{console.log("Reconnecting SSE..."),this.connect()},c),this.reconnectDelay=Math.min(this.reconnectDelay*2,30000)}reconnectIfNeeded(){let n=Date.now();if(this.status==="connected"){if(this.lastActivityAt&&n-this.lastActivityAt>this.staleThresholdMs)this.forceReconnect();return}if(this.cooldownUntil&&n<this.cooldownUntil)return;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null;this.connect()}disconnect(){if(this.connecting=!1,this.clearStaleMonitor(),this.eventSource)this.eventSource.close(),this.eventSource=null;if(this.reconnectTimeout)clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null}}async function Sf(n,r,i){let _=i?`?chat_jid=${encodeURIComponent(i)}`:"";return P(`/post/${n}/annotations${_}`,{method:"PATCH",body:JSON.stringify({annotations:r})})}var nn="",li=1073741824,Qf=8388608;var bn=Y(()=>{X_()});function Zn(n){if(typeof window>"u"||!window.localStorage)return null;try{return window.localStorage.getItem(n)}catch{return null}}function fn(n,r){if(typeof window>"u"||!window.localStorage)return;try{window.localStorage.setItem(n,r)}catch{return}}function Bi(n,r=!1){let i=Zn(n);if(i===null)return r;return i==="true"}function ki(n,r=null){let i=Zn(n);if(i===null)return r;let _=parseInt(i,10);return Number.isFinite(_)?_:r}function Z_(n){let r=Zn(n);if(!r)return null;try{return JSON.parse(r)}catch{return null}}function af(n){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(Gr,{detail:{enabled:Boolean(n)}}))}function C_(n){if(typeof fetch!=="function")return;xi({ui_meters:n}).catch((r)=>{console.debug("[meters] Failed to persist meters UI state.",r)})}function nl(n){if(typeof window>"u")return;window.dispatchEvent(new CustomEvent(mf,{detail:{collapsed:Boolean(n)}}))}function Wi(n=!1){return Bi(I_,n)}function xo(n=!1){return Bi(Y_,n)}function Ur(n,r={}){let i=r.persist!==!1,_=r.persistServer!==!1,c=Boolean(n);if(i)fn(I_,c?"true":"false");if(_)C_({enabled:c});return af(c),c}function rl(n,r={}){let i=r.persist!==!1,_=r.persistServer!==!1,c=Boolean(n);if(i)fn(Y_,c?"true":"false");if(_)C_({collapsed:c});return nl(c),c}function vo(n){let r=typeof n?.mode==="string"?n.mode.trim().toLowerCase():"";if(typeof n?.enabled==="boolean")Ur(Boolean(n.enabled),{persistServer:!1});else if(r==="toggle"){let i=!Wi(!1);Ur(i,{persistServer:!1})}if(typeof n?.collapsed==="boolean")rl(Boolean(n.collapsed),{persistServer:!1})}var I_="piclaw_system_meters_enabled",Y_="piclaw_system_meters_collapsed",Gr="piclaw-meters-change",mf="piclaw-meters-collapsed-change";var O_=Y(()=>{bn()});function J_(n,r){if(n===""||n===null||n===void 0)return r;let i=Number(n);return Number.isFinite(i)?i:r}function E_(n,{min:r=-1/0,max:i=1/0}={}){let _=Number.isFinite(Number(r))?Number(r):-1/0,c=Number.isFinite(Number(i))?Number(i):1/0;return Math.min(c,Math.max(_,Number(n)))}function In(n,{fallback:r=0,min:i=-1/0,max:_=1/0}={}){let c=J_(n,r);return E_(c,{min:i,max:_})}function il(n,{direction:r=1,step:i=1,fallback:_=0,min:c=-1/0,max:u=1/0}={}){let f=In(n,{fallback:_,min:c,max:u}),o=Math.abs(J_(i,1))||1,s=Number(r)<0?-1:1;return E_(f+s*o,{min:c,max:u})}function e({value:n,min:r,max:i,step:_=1,fallback:c,width:u="80px",disabled:f=!1,label:o,onChange:s}){let $=Number.isFinite(Number(c))?Number(c):In(n,{fallback:0,min:r,max:i}),[p,g]=w(String(n??$)),b=Z(!1);X(()=>{if(!b.current)g(String(n??$))},[n,$]);let x=T((F)=>{b.current=!1;let y=In(F,{fallback:$,min:r,max:i});g(String(y)),s?.(y)},[$,r,i,s]),v=T((F)=>{b.current=!1;let y=il(n,{direction:F,step:_,fallback:$,min:r,max:i});g(String(y)),s?.(y)},[$,i,r,s,_,n]);return l`
        <span class="settings-number-stepper">
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Decrease ${o||"value"}`}
                title=${`Decrease ${o||"value"}`}
                disabled=${f}
                onClick=${()=>v(-1)}
            >−</button>
            <input
                class="settings-number-input"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                value=${p}
                disabled=${f}
                style=${`width:${u}`}
                onInput=${(F)=>{b.current=!0,g(F.target.value)}}
                onBlur=${(F)=>x(F.target.value)}
                onKeyDown=${(F)=>{if(F.key==="Enter")F.preventDefault(),x(F.target.value),F.target.blur()}}
            />
            <button
                type="button"
                class="settings-number-step-btn"
                aria-label=${`Increase ${o||"value"}`}
                title=${`Increase ${o||"value"}`}
                disabled=${f}
                onClick=${()=>v(1)}
            >+</button>
        </span>
    `}var Yn=Y(()=>{m()});function d_(n){let r=String(n||"").trim();if(!r)return"";if(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("data:")||r.startsWith("blob:"))return r;if(r.startsWith("/workspace/"))return`/workspace/file?path=${encodeURIComponent(r.slice(11))}`;if(r.startsWith("/"))return"";if(/^[a-zA-Z]:[\\/]/.test(r))return"";if(r.startsWith("\\\\"))return"";if(r.includes("\\"))return"";return`/workspace/file?path=${encodeURIComponent(r.replace(/^\.\//,""))}`}function S_({value:n,onChange:r}){let i=Z(null),[_,c]=w(d_(n));X(()=>{c(d_(n))},[n]);let u=T((f)=>{let o=f.target.files?.[0];if(!o)return;let s=new FileReader;s.onload=()=>{let $=s.result;c($),r?.($)},s.readAsDataURL(o)},[r]);return l`
        <div class="settings-avatar-inline" onClick=${()=>i.current?.click()} title="Click to upload">
            ${_?l`<img src=${_} alt="avatar" />`:l`<span class="settings-avatar-placeholder">+</span>`}
            <input type="file" accept="image/*" ref=${i} style="display:none" onChange=${u} />
        </div>
    `}function e_(n={}){return{userName:n.userName||"",userAvatar:n.userAvatar||"",assistantName:n.assistantName||"",assistantAvatar:n.assistantAvatar||"",composeUploadLimitMb:n.composeUploadLimitMb??32,workspaceUploadLimitMb:n.workspaceUploadLimitMb??256}}async function _l(n,r={}){let i=typeof n==="string"?n:"";if(!i)return!1;let _=r.navigator??(typeof navigator<"u"?navigator:null),c=r.document??(typeof document<"u"?document:null);if(_?.clipboard?.writeText)try{return await _.clipboard.writeText(i),!0}catch(u){}try{if(!c?.body||typeof c.createElement!=="function"||typeof c.execCommand!=="function")return!1;let u=c.createElement("textarea");u.value=i,u.setAttribute?.("readonly",""),u.style.position="fixed",u.style.left="-9999px",u.style.top="0",u.style.opacity="0",c.body.appendChild(u),u.focus?.(),u.select?.();let f=Boolean(c.execCommand("copy"));return c.body.removeChild(u),f}catch(u){return!1}}function ji({settingsData:n,setStatus:r,mergeSettingsData:i}){let[_,c]=w(""),[u,f]=w(""),[o,s]=w(""),[$,p]=w(""),[g,b]=w(32),[x,v]=w(256),[F,y]=w(""),[K,W]=w(!1),[L,B]=w(!1),[U,z]=w(!1),[j,Q]=w(()=>Wi(!1)),[t,G]=w(!1),k=Z(""),h=Z(null),H=Z(!0);X(()=>{return H.current=!0,()=>{H.current=!1}},[]);let A=T((I)=>{let V=e_(I);c(V.userName),f(V.userAvatar),s(V.assistantName),p(V.assistantAvatar),b(V.composeUploadLimitMb),v(V.workspaceUploadLimitMb),y(I?.widgetToken||""),k.current=JSON.stringify(V)},[]);X(()=>{A(n||{})},[n,A]),X(()=>{let I=(V)=>{Q(Boolean(V?.detail?.enabled))};return window.addEventListener(Gr,I),()=>window.removeEventListener(Gr,I)},[]);let C=D(()=>JSON.stringify(e_({userName:_,userAvatar:u,assistantName:o,assistantAvatar:$,composeUploadLimitMb:g,workspaceUploadLimitMb:x})),[_,u,o,$,g,x]);X(()=>{if(C===k.current)return;if(h.current)clearTimeout(h.current);return h.current=setTimeout(async()=>{if(!H.current)return;let I=document.activeElement;if(I&&I.closest?.(".settings-number-stepper"))return;try{let V=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:C}),q=await V.json().catch(()=>({}));if(!H.current)return;if(!V.ok||!q?.ok||!q?.settings)return;k.current=C,i?.(q.settings),G(!0),setTimeout(()=>{if(H.current)G(!1)},4000)}catch(V){console.warn("[settings/general] Failed to persist general settings snapshot.",V)}},800),()=>{if(h.current)clearTimeout(h.current)}},[C,i]);let O=n?.instanceTotp||{configured:!1,issuer:o||"Piclaw",label:_?`${o||"Piclaw"}:${_}`:o||"Piclaw",secret:"",otpauth:"",qrSvg:""},gn=T(async()=>{if(!F)return;if(await _l(F))B(!0),setTimeout(()=>{if(H.current)B(!1)},3000);else r?.("Could not copy widget token. Select the token field and copy manually."),console.warn("[settings/general] Failed to copy widget token. Clipboard APIs unavailable or blocked.")},[F,r]),a=T(async()=>{if(U)return;if(!confirm("Regenerate the widget token? Existing macOS widgets using the old token will stop updating."))return;z(!0);try{let I=await fetch("/agent/settings/widget-token/regenerate",{method:"POST"}),V=await I.json().catch(()=>({}));if(!I.ok||!V?.ok||!V?.settings)throw Error(V?.error||"Failed to regenerate widget token.");y(V.settings.widgetToken||""),i?.(V.settings),G(!0),setTimeout(()=>{if(H.current)G(!1)},4000)}catch(I){console.warn("[settings/general] Failed to regenerate widget token.",I)}finally{if(H.current)z(!1)}},[U,i]),un=typeof window<"u"&&window.isSecureContext,ln=F?"•".repeat(Math.min(Math.max(F.length,16),48)):"—",wn=K?F||"—":ln;return l`
        <div class="settings-section">
            ${t&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Identity</h3>
            <div class="settings-row">
                <label>User</label>
                <${S_} value=${u} onChange=${f} />
                <input type="text" value=${_} onInput=${(I)=>c(I.target.value)} placeholder="Your name" />
            </div>
            <div class="settings-row">
                <label>Agent</label>
                <${S_} value=${$} onChange=${p} />
                <input type="text" value=${o} onInput=${(I)=>s(I.target.value)} placeholder="Agent name" />
            </div>

            <h3 style="margin-top:20px">Notifications</h3>
            ${un?l`
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
                        onChange=${()=>{let I=Ur(!j);Q(I)}} />
                    <span class="settings-hint" style="margin:0">CPU/memory/network meters in the status bar. This browser only.</span>
                </div>
            </div>

            <h3 style="margin-top:20px">Instance Configuration</h3>
            <div class="settings-row">
                <label>Compose upload (MB)</label>
                <${e}
                    label="compose upload limit"
                    value=${g}
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
                <${e}
                    label="workspace upload limit"
                    value=${x}
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
                        <code class="settings-keychain-reveal-value settings-widget-token-value">${wn}</code>
                        <button class=${`settings-keychain-reveal-btn${K?" active":""}`}
                            type="button"
                            onClick=${()=>W((I)=>!I)}
                            disabled=${!F}
                            title=${K?"Hide token":"Reveal token"}>
                            ${K?l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                        </button>
                        <button class="settings-keychain-copy-btn" type="button" onClick=${gn} disabled=${!F} title="Copy token">
                            ${L?l`<span class="settings-widget-token-copied">Copied</span>`:l`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`}
                        </button>
                        <button class="settings-keychain-prompt-submit settings-widget-token-regenerate" type="button" onClick=${a} disabled=${U}>${U?"Regenerating…":"Regenerate"}</button>
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
    `}var m_=Y(()=>{m();O_();Yn()});var nc={};_n(nc,{SessionsSection:()=>cl});function a_(n={}){return{sessionAutoRotate:n.sessionAutoRotate!==!1,sessionMaxSizeMb:n.sessionMaxSizeMb??16,sessionMaxLines:n.sessionMaxLines??4000,sessionMaxCompactions:n.sessionMaxCompactions??3,sessionIsolation:n.sessionIsolation||"none",toolUseBudget:n.toolUseBudget??64}}function cl({settingsData:n,setStatus:r,mergeSettingsData:i}){let[_,c]=w(!0),[u,f]=w(16),[o,s]=w(4000),[$,p]=w(3),[g,b]=w(64),[x,v]=w("none"),[F,y]=w(!1),K=Z(""),W=Z(null),L=Z(!0);X(()=>{return L.current=!0,()=>{L.current=!1}},[]);let B=T((z)=>{let j=a_(z);c(j.sessionAutoRotate),f(j.sessionMaxSizeMb),s(j.sessionMaxLines),p(j.sessionMaxCompactions),b(j.toolUseBudget),v(j.sessionIsolation),K.current=JSON.stringify(j)},[]);X(()=>{B(n||{})},[n,B]);let U=D(()=>JSON.stringify(a_({sessionAutoRotate:_,sessionMaxSizeMb:u,sessionMaxLines:o,sessionMaxCompactions:$,toolUseBudget:g,sessionIsolation:x})),[_,u,o,$,g,x]);return X(()=>{if(U===K.current)return;if(W.current)clearTimeout(W.current);return W.current=setTimeout(async()=>{if(!L.current)return;let z=document.activeElement;if(z&&z.closest?.(".settings-number-stepper"))return;try{let j=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:U}),Q=await j.json().catch(()=>({}));if(!L.current)return;if(!j.ok||!Q?.ok||!Q?.settings)return;K.current=U,i?.(Q.settings),y(!0),setTimeout(()=>{if(L.current)y(!1)},4000)}catch(j){console.warn("[settings/sessions] Failed to persist session settings.",j)}},800),()=>{if(W.current)clearTimeout(W.current)}},[U,i]),l`
        <div class="settings-section">
            ${F&&l`
                <div class="settings-general-applied-notice" role="status" aria-live="polite">
                    Settings applied. Changes take effect on the next turn.
                </div>
            `}
            <h3>Session Lifecycle</h3>
            <div class="settings-row">
                <label>Auto-rotate sessions</label>
                <input type="checkbox" checked=${_} onChange=${(z)=>c(z.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Max session size (MB)</label>
                <${e}
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
                <${e}
                    label="tool use budget"
                    value=${g}
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
                <select value=${x} onChange=${(z)=>v(z.target.value)}>
                    <option value="none">None — full cross-session visibility</option>
                    <option value="summary">Summary — tools visible, no arguments</option>
                    <option value="full">Full — sessions cannot see each other</option>
                </select>
            </div>
        </div>
    `}var rc=Y(()=>{m();Yn()});var ic={};_n(ic,{__recordingsSettingsTest:()=>ol,RecordingsSection:()=>ll});function Lr(n){if(!n)return"—";let r=new Date(n);if(Number.isNaN(r.getTime()))return n;return r.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Ri(n){if(n==="full")return"full / trusted";if(n==="metadata")return"metadata only";return"redacted"}function Hr({children:n,type:r="neutral"}){return l`<span class=${`settings-task-pill settings-task-pill-${r}`}>${n}</span>`}function ul(){if(typeof window>"u")return"web:default";return String(window.__piclawCurrentChatJid||"web:default")}function fr(n){return String(n||"").split(`
`).map((r)=>r.trim()).filter(Boolean)}function fl({recording:n,details:r,onDelete:i,onRefresh:_}){if(!n)return l`<div class="settings-task-detail-empty">Select a recording to inspect, replay, export, or delete it.</div>`;let c=r?.meta||n,u=Array.isArray(r?.events)?r.events:[],f=u.reduce((s,$)=>s+(Array.isArray($.redactions)?$.redactions.length:0),0),o=u.reduce((s,$)=>{let p=$.kind||"event";return s[p]=(s[p]||0)+1,s},{});return l`
        <div class="settings-task-detail settings-recording-detail">
            <div class="settings-task-detail-header">
                <div>
                    <h4>${c.title||c.id}</h4>
                    <code>${c.id}</code>
                </div>
                <div class="settings-task-detail-actions">
                    <button onClick=${()=>window.open(yi(c.id),"_blank","noopener,noreferrer")}>Playback</button>
                    <button onClick=${_}>Refresh</button>
                    <button class="danger" onClick=${()=>i(c)}>Delete</button>
                </div>
            </div>
            <div class="settings-task-detail-grid">
                <span>Status</span><strong>${c.status||"—"}</strong>
                <span>Mode</span><strong>${Ri(c.mode)}</strong>
                <span>Chat</span><code>${c.chatJid||"—"}</code>
                <span>Started</span><strong>${Lr(c.startedAt)}</strong>
                <span>Ended</span><strong>${Lr(c.endedAt)}</strong>
                <span>Events</span><strong>${c.eventCount??u.length}</strong>
                <span>Redactions</span><strong>${f}</strong>
            </div>
            <div class="settings-recording-export-row">
                <a href=${ur(c.id,"json")}>Export JSON</a>
                <a href=${ur(c.id,"jsonl")}>Export JSONL</a>
                <a href=${ur(c.id,"html")}>Export standalone HTML</a>
            </div>
            <h4>Event summary</h4>
            ${u.length===0&&l`<p class="settings-hint">Open or refresh details to inspect trace events.</p>`}
            ${u.length>0&&l`
                <div class="settings-recording-event-summary">
                    ${Object.entries(o).map(([s,$])=>l`<${Hr}>${s}: ${$}<//>`)}
                </div>
                <div class="settings-task-command-block">
                    <strong>First events</strong>
                    <pre>${JSON.stringify(u.slice(0,5),null,2)}</pre>
                </div>
            `}
        </div>
    `}function ll({filter:n="",setStatus:r}){let[i,_]=w([]),[c,u]=w([]),[f,o]=w(!0),[s,$]=w(null),[p,g]=w(null),[b,x]=w(null),[v,F]=w(!1),[y,K]=w(ul),[W,L]=w(""),[B,U]=w("redacted"),[z,j]=w(!0),[Q,t]=w(""),[G,k]=w(""),[h,H]=w('{"Authorization":"Bearer abc1234567890","content":"hello"}'),[A,C]=w(null);X(()=>{let N=(d)=>{let cn=String(d?.detail?.chatJid||"").trim();if(cn)K(cn)};return window.addEventListener("piclaw:current-chat-changed",N),()=>window.removeEventListener("piclaw:current-chat-changed",N)},[]);let O=T(async(N=p)=>{o(!0),$(null);try{let d=await gi(),cn=d.recordings||[];_(cn),u(d.active||[]);let Fn=cn.find((R)=>R.id===N)||cn[0]||null;if(g(Fn?.id||null),Fn?.id)x(await Rr(Fn.id));else x(null)}catch(d){$(d?.message||"Failed to load recordings.")}finally{o(!1)}},[p]);X(()=>{O()},[O]);let gn=D(()=>i.find((N)=>N.id===p)||null,[i,p]),a=D(()=>c.find((N)=>N.chatJid===y)||null,[c,y]),un=String(n||"").trim().toLowerCase(),ln=D(()=>{if(!un)return i;return i.filter((N)=>[N.id,N.title,N.chatJid,N.status,N.mode].some((d)=>String(d||"").toLowerCase().includes(un)))},[i,un]),wn=T(async(N)=>{if(g(N?.id||null),x(null),!N?.id)return;try{x(await Rr(N.id))}catch(d){r?.(d?.message||"Failed to load recording.","error")}},[r]),I=T(async()=>{if(v)return;F(!0);try{let N={keys:fr(Q),patterns:fr(G)},d=await $i({chat_jid:y,title:W||void 0,mode:B,include_timeline_snapshot:z,timeline_snapshot_limit:80,redaction:N});r?.(`Recording started for ${y}.`,"success"),await O(d?.recording?.id)}catch(N){r?.(N?.message||"Failed to start recording.","error")}finally{F(!1)}},[v,y,Q,G,z,O,B,r,W]),V=T(async(N=a)=>{if(!N||v)return;F(!0);try{let d=await wi({id:N.id});r?.(`Recording stopped for ${N.chatJid}.`,"success"),await O(d?.recording?.id)}catch(d){r?.(d?.message||"Failed to stop recording.","error")}finally{F(!1)}},[v,a,O,r]),q=T(async(N)=>{if(!N||v)return;if(!window.confirm(`Delete recording ${N.id}?

${N.title||""}`))return;F(!0);try{await ti(N.id),r?.("Recording deleted.","success"),await O(null)}catch(d){r?.(d?.message||"Failed to delete recording.","error")}finally{F(!1)}},[v,O,r]),yn=T(async()=>{try{let N=JSON.parse(h||"null"),d=await hi(N,{mode:B,redaction:{keys:fr(Q),patterns:fr(G)}});C(d.preview)}catch(N){C({error:N?.message||"Preview failed."})}},[Q,G,B,h]);return l`
        <div class="settings-section settings-recordings-section">
            <div class="settings-recording-start-card">
                <h3>Session Recording</h3>
                <p class="settings-hint">Opt-in trace capture for deterministic playback and screen-recording exports. Playback never calls live agent or tool endpoints.</p>
                <div class="settings-recording-form-grid">
                    <label>Chat JID<input value=${y} onInput=${(N)=>K(N.target.value)} /></label>
                    <label>Title<input placeholder="Demo recording" value=${W} onInput=${(N)=>L(N.target.value)} /></label>
                    <label>Mode<select value=${B} onChange=${(N)=>U(N.target.value)}><option value="redacted">Redacted</option><option value="metadata">Metadata only</option><option value="full">Full / trusted local</option></select></label>
                    <label class="settings-recording-checkbox"><input type="checkbox" checked=${z} onChange=${(N)=>j(N.target.checked)} /> Include timeline snapshot</label>
                </div>
                <div class="settings-recording-form-grid settings-recording-redaction-grid">
                    <label>Extra redacted keys<textarea rows="2" placeholder="customer_id\ninternal_code" value=${Q} onInput=${(N)=>t(N.target.value)} /></label>
                    <label>Extra regex patterns<textarea rows="2" placeholder="ACME-[0-9]+" value=${G} onInput=${(N)=>k(N.target.value)} /></label>
                </div>
                <div class="settings-task-detail-actions">
                    ${a?l`<button onClick=${()=>V(a)} disabled=${v}>Stop current chat recording</button>`:l`<button onClick=${I} disabled=${v}>Start recording</button>`}
                    <button onClick=${()=>O()} disabled=${f}>Refresh</button>
                </div>
                ${c.length>0&&l`<div class="settings-recording-active-row">${c.map((N)=>l`<${Hr} type="active">REC ${N.chatJid}<//>`)}</div>`}
            </div>

            <details class="settings-recording-preview">
                <summary>Redaction preview</summary>
                <textarea rows="4" value=${h} onInput=${(N)=>H(N.target.value)} />
                <div class="settings-task-detail-actions"><button onClick=${yn}>Preview redaction</button></div>
                ${A&&l`<pre>${JSON.stringify(A,null,2)}</pre>`}
            </details>

            ${f&&l`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading recordings…</span></div>`}
            ${s&&l`<div class="settings-error-state">${s}</div>`}
            ${!f&&!s&&i.length===0&&l`<div class="settings-empty-state"><strong>No recordings yet.</strong><p>Start a recording above, then use playback/export for deterministic screen capture.</p></div>`}
            ${!f&&!s&&i.length>0&&l`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Session recordings">
                        ${ln.map((N)=>l`
                            <button class=${`settings-task-row ${N.id===p?"active":""}`} onClick=${()=>wn(N)}>
                                <span class="settings-task-row-main"><strong>${N.title||N.id}</strong><span>${N.chatJid} · ${Lr(N.startedAt)}</span></span>
                                <span class="settings-task-row-meta"><${Hr} type=${N.status==="recording"?"active":"completed"}>${N.status}<//><${Hr}>${Ri(N.mode)}<//></span>
                                <span class="settings-task-row-times">${N.eventCount||0} events</span>
                            </button>
                        `)}
                        ${ln.length===0&&l`<p class="settings-hint">No recordings match “${n}”.</p>`}
                    </div>
                    <${fl} recording=${gn} details=${b} onDelete=${q} onRefresh=${()=>gn&&wn(gn)} />
                </div>
            `}
        </div>
    `}var ol;var _c=Y(()=>{m();bn();ol={formatDateTime:Lr,modeLabel:Ri,parseList:fr}});var cc={};_n(cc,{CompactionSection:()=>gl});function sl(n={}){return{compactionTimeoutSec:n.compactionTimeoutSec??180,compactionBackoffBaseMin:n.compactionBackoffBaseMin??15,compactionBackoffMaxMin:n.compactionBackoffMaxMin??360,compactionThresholdPercent:n.compactionThresholdPercent??75,compactionBackoffDecayFactor:n.compactionBackoffDecayFactor??0.5,toolResultCompactionEnabled:Boolean(n.toolResultCompactionEnabled??!0),toolResultSemanticSummaryEnabled:Boolean(n.toolResultSemanticSummaryEnabled??!0),toolResultSemanticSummaryMaxInputChars:n.toolResultSemanticSummaryMaxInputChars??12000,toolResultSemanticSummaryMaxTokens:n.toolResultSemanticSummaryMaxTokens??320,toolResultSemanticSummaryTimeoutSec:n.toolResultSemanticSummaryTimeoutSec??12,progressWatchdogEnabled:Boolean(n.progressWatchdogEnabled??!1),progressWatchdogTimeoutSec:n.progressWatchdogTimeoutSec??120,compactionBackoffs:Array.isArray(n.compactionBackoffs)?n.compactionBackoffs:[],progressWatchdogPhases:Array.isArray(n.progressWatchdogPhases)?n.progressWatchdogPhases:[]}}function Ti(n){let r=String(n||"").trim();if(!r)return"—";let i=new Date(r);if(Number.isNaN(i.getTime()))return r;return i.toLocaleString()}function gl({settingsData:n,setStatus:r,mergeSettingsData:i}){let[_,c]=w(180),[u,f]=w(15),[o,s]=w(360),[$,p]=w(75),[g,b]=w(0.5),[x,v]=w(!0),[F,y]=w(!0),[K,W]=w(12000),[L,B]=w(320),[U,z]=w(12),[j,Q]=w(!1),[t,G]=w(120),[k,h]=w([]),[H,A]=w([]),[C,O]=w(!1),gn=Z(""),a=Z(null),un=Z(!0);X(()=>{return un.current=!0,()=>{un.current=!1}},[]);let ln=T((V)=>{let q=sl(V);c(q.compactionTimeoutSec),f(q.compactionBackoffBaseMin),s(q.compactionBackoffMaxMin),p(q.compactionThresholdPercent),b(q.compactionBackoffDecayFactor),v(q.toolResultCompactionEnabled),y(q.toolResultSemanticSummaryEnabled),W(q.toolResultSemanticSummaryMaxInputChars),B(q.toolResultSemanticSummaryMaxTokens),z(q.toolResultSemanticSummaryTimeoutSec),Q(q.progressWatchdogEnabled),G(q.progressWatchdogTimeoutSec),h(q.compactionBackoffs),A(q.progressWatchdogPhases),gn.current=JSON.stringify({compactionTimeoutSec:q.compactionTimeoutSec,compactionBackoffBaseMin:q.compactionBackoffBaseMin,compactionBackoffMaxMin:q.compactionBackoffMaxMin,compactionThresholdPercent:q.compactionThresholdPercent,compactionBackoffDecayFactor:q.compactionBackoffDecayFactor,toolResultCompactionEnabled:q.toolResultCompactionEnabled,toolResultSemanticSummaryEnabled:q.toolResultSemanticSummaryEnabled,toolResultSemanticSummaryMaxInputChars:q.toolResultSemanticSummaryMaxInputChars,toolResultSemanticSummaryMaxTokens:q.toolResultSemanticSummaryMaxTokens,toolResultSemanticSummaryTimeoutSec:q.toolResultSemanticSummaryTimeoutSec,progressWatchdogEnabled:q.progressWatchdogEnabled,progressWatchdogTimeoutSec:q.progressWatchdogTimeoutSec})},[]);X(()=>{ln(n||{})},[n,ln]);let wn=D(()=>JSON.stringify({compactionTimeoutSec:_,compactionBackoffBaseMin:u,compactionBackoffMaxMin:o,compactionThresholdPercent:$,compactionBackoffDecayFactor:g,toolResultCompactionEnabled:x,toolResultSemanticSummaryEnabled:F,toolResultSemanticSummaryMaxInputChars:K,toolResultSemanticSummaryMaxTokens:L,toolResultSemanticSummaryTimeoutSec:U,progressWatchdogEnabled:j,progressWatchdogTimeoutSec:t}),[_,u,o,$,g,x,F,K,L,U,j,t]);X(()=>{if(wn===gn.current)return;if(a.current)clearTimeout(a.current);return a.current=setTimeout(async()=>{if(!un.current)return;try{r?.("Saving compaction settings…","info");let V=await fetch("/agent/settings/compaction",{method:"POST",headers:{"Content-Type":"application/json"},body:wn}),q=await V.json().catch(()=>({}));if(!un.current)return;if(!V.ok||!q?.ok||!q?.settings){r?.(q?.error||"Failed to save compaction settings.","error");return}gn.current=wn,i?.(q.settings),ln({...n||{},...q.settings||{}}),r?.("Compaction settings saved.","success"),O(!0),setTimeout(()=>{if(un.current)O(!1),r?.(null)},4000)}catch(V){if(console.warn("[settings/compaction] Failed to persist compaction settings.",V),un.current)r?.("Failed to save compaction settings.","error")}},800),()=>{if(a.current)clearTimeout(a.current)}},[wn,i,r,ln,n]);let I=T(async(V)=>{try{r?.(`Clearing compaction suppression for ${V}…`,"info");let q=await fetch("/agent/settings/compaction/reset-backoff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatJid:V})}),yn=await q.json().catch(()=>({}));if(!q.ok||!yn?.ok||!yn?.settings){r?.(yn?.error||"Failed to clear compaction suppression.","error");return}i?.(yn.settings),ln({...n||{},...yn.settings||{}}),r?.(`Cleared compaction suppression for ${V}.`,"success")}catch(q){console.warn("[settings/compaction] Failed to clear compaction suppression.",q),r?.("Failed to clear compaction suppression.","error")}},[ln,i,r,n]);return l`
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
                    <input type="checkbox" checked=${x} onChange=${(V)=>v(Boolean(V.target.checked))} />
                    <span class="settings-hint" style="margin:0">When disabled, large tool results stay inline and are not externalized into searchable tool-output handles.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Semantic summaries for compacted tool results</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${F} onChange=${(V)=>y(Boolean(V.target.checked))} />
                    <span class="settings-hint" style="margin:0">When enabled, compacted outputs include a semantic summary generated with the active model (preview fallback on failure).</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Semantic summary input limit (chars)</label>
                <${e}
                    label="semantic summary input limit"
                    value=${K}
                    min=${500}
                    max=${200000}
                    fallback=${12000}
                    width="100px"
                    disabled=${!F}
                    onChange=${W}
                />
                <span class="settings-hint" style="margin:0">Maximum characters sampled from full tool output for semantic summarization.</span>
            </div>
            <div class="settings-row">
                <label>Semantic summary output max tokens</label>
                <${e}
                    label="semantic summary max tokens"
                    value=${L}
                    min=${64}
                    max=${4096}
                    fallback=${320}
                    width="90px"
                    disabled=${!F}
                    onChange=${B}
                />
                <span class="settings-hint" style="margin:0">Upper bound for generated summary length.</span>
            </div>
            <div class="settings-row">
                <label>Semantic summary timeout (sec)</label>
                <${e}
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
                <${e}
                    label="compaction threshold"
                    value=${$}
                    min=${10}
                    max=${95}
                    fallback=${75}
                    width="80px"
                    onChange=${p}
                />
                <span class="settings-hint" style="margin:0">auto-compact when context exceeds this % of window</span>
            </div>
            <div class="settings-row">
                <label>Compaction timeout (sec)</label>
                <${e}
                    label="compaction timeout"
                    value=${_}
                    min=${1}
                    max=${3600}
                    fallback=${180}
                    width="90px"
                    onChange=${c}
                />
                <span class="settings-hint" style="margin:0">Abort a stuck pre-prompt/manual compaction instead of hanging forever.</span>
            </div>
            <div class="settings-row">
                <label>Failure backoff base (min)</label>
                <${e}
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
                <${e}
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
                <${e}
                    label="backoff decay factor"
                    value=${Math.round(g*100)}
                    min=${10}
                    max=${100}
                    fallback=${50}
                    width="80px"
                    onChange=${(V)=>b(V/100)}
                />
                <span class="settings-hint" style="margin:0">% — halves backoff after each successful compaction</span>
            </div>

            <h3 style="margin-top:20px">Stall watchdog</h3>
            <div class="settings-row">
                <label>Enable watchdog</label>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" checked=${j} onChange=${(V)=>Q(Boolean(V.target.checked))} />
                    <span class="settings-hint" style="margin:0">Disabled by default. When enabled, a helper process terminates the runtime if an active phase stops heartbeating.</span>
                </div>
            </div>
            <div class="settings-row">
                <label>Watchdog timeout (sec)</label>
                <${e}
                    label="watchdog timeout"
                    value=${t}
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
            ${k.length===0?l`
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
                            ${k.map((V)=>l`
                                <tr>
                                    <td><code>${V.chatJid}</code></td>
                                    <td>${V.failureCount}</td>
                                    <td>${Ti(V.backoffUntil)}</td>
                                    <td title=${V.lastErrorMessage||""}>${V.lastErrorMessage||"—"}</td>
                                    <td>
                                        <button class="settings-secondary-btn" onClick=${()=>I(V.chatJid)}>
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
                            ${H.map((V)=>l`
                                <tr>
                                    <td><code>${V.chatJid}</code></td>
                                    <td>${V.phase}</td>
                                    <td>${Ti(V.startedAt)}</td>
                                    <td>${Ti(V.lastProgressAt)}</td>
                                </tr>
                            `)}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `}var uc=Y(()=>{m();Yn()});function lc(n){let r=String(n||"").trim().toLowerCase();if(!r)return null;let i=tl[r]||r;if(/^f(?:[1-9]|1[0-2])$/.test(i))return i;if(yl.has(i))return i;if(i.length===1)return i;if(/^[a-z0-9]+$/.test(i))return i;return null}function Cn(n){let r=String(n||"").trim();if(!r)return null;let i=r.split("+").map((u)=>u.trim()).filter(Boolean);if(!i.length)return null;let _={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let u of i){let f=u.toLowerCase(),o=wl[f];if(o){_[o]=!0;continue}if(_.key)return null;let s=lc(u);if(!s||s==="escape")return null;_.key=s}if(!_.key)return null;let c=[];if(_.ctrl)c.push("ctrl");if(_.meta)c.push("meta");if(_.alt)c.push("alt");if(_.shift)c.push("shift");return c.push(_.key),c.join("+")}function oc(n){return String(n||"").split(/[\n,]/).map((r)=>Cn(r)).filter((r)=>Boolean(r))}function Wn(n){return n.join(", ")}function Gi(){let n=Z_(fc);if(!n||typeof n!=="object")return{};let r={};for(let i of lr){let _=n[i.id];if(!Array.isArray(_))continue;let c=_.map((u)=>Cn(String(u||""))).filter((u)=>Boolean(u));r[i.id]=[...new Set(c)]}return r}function Ui(n){if(fn(fc,JSON.stringify(n)),typeof window<"u")window.dispatchEvent(new CustomEvent("piclaw:keyboard-shortcuts-changed",{detail:{config:n}}))}function sc(n){return $l.get(n)}function or(n){let r=Gi()[n];if(Array.isArray(r))return r;return[...sc(n).defaultBindings]}function gc(n,r){let i=Gi(),_=sc(n).defaultBindings,c=[...new Set(r.map((u)=>Cn(u)).filter((u)=>Boolean(u)))];if(c.length===_.length&&c.every((u,f)=>u===_[f]))delete i[n];else i[n]=c;Ui(i)}function Hi(n){if(!n){Ui({});return}let r=Gi();delete r[n],Ui(r)}function Nr(){let n={};for(let r of lr)n[r.id]=or(r.id);return n}function hl(n){let r=typeof n==="string"?n:"";if(!r)return"";if(r.length===1)return r.toLowerCase();return lc(r)||r.toLowerCase()}function xl(n){let r=Cn(n);if(!r)return null;let i={ctrl:!1,meta:!1,alt:!1,shift:!1,key:""};for(let _ of r.split("+")){if(_==="ctrl"||_==="meta"||_==="alt"||_==="shift"){i[_]=!0;continue}i.key=_}return i.key?i:null}function vl(n,r){let i=xl(r);if(!i)return!1;if(hl(n?.key)!==i.key)return!1;let c=!i.shift&&i.key.length===1&&/[^a-z0-9]/i.test(i.key);return Boolean(n?.ctrlKey)===i.ctrl&&Boolean(n?.metaKey)===i.meta&&Boolean(n?.altKey)===i.alt&&(c||Boolean(n?.shiftKey)===i.shift)}function Lo(n,r){return or(r).some((i)=>vl(n,i))}var fc="piclaw_keyboard_shortcuts_v1",lr,$l,wl,tl,yl;var $c=Y(()=>{lr=[{id:"openHelp",label:"Open keyboard help",description:"Open Settings → Keyboard. Default: question mark and quote when focus is outside compose and other editable fields.",defaultBindings:["?",'"']},{id:"openSettings",label:"Open settings",description:"Open the settings dialog.",defaultBindings:["ctrl+,","meta+,","alt+,"]},{id:"previousChat",label:"Previous session",description:"Switch to the previous visible chat/session.",defaultBindings:["["]},{id:"nextChat",label:"Next session",description:"Switch to the next visible chat/session.",defaultBindings:["]"]},{id:"toggleDock",label:"Toggle dock",description:"Show or hide the bottom dock panes.",defaultBindings:["ctrl+`"]},{id:"toggleZenMode",label:"Toggle zen mode",description:"Collapse surrounding chrome for a focused chat view.",defaultBindings:["ctrl+shift+z","meta+shift+z"]}],$l=new Map(lr.map((n)=>[n.id,n])),wl={cmd:"meta",command:"meta",meta:"meta",super:"meta",ctrl:"ctrl",control:"ctrl",alt:"alt",option:"alt",shift:"shift"},tl={esc:"escape",return:"enter",spacebar:"space"},yl=new Set(["tab","enter","space","backspace","delete","insert","clear","home","end","pageup","pagedown","up","down","left","right"])});var wc={};_n(wc,{KeyboardSection:()=>bl});function pl(n,r,i){let _=String(n||"").trim().toLowerCase();if(!_)return!0;return[r.label,r.description,i,...r.defaultBindings||[]].some((c)=>String(c||"").toLowerCase().includes(_))}function bl({filter:n="",setStatus:r}){let[i,_]=w(()=>{let s=Nr();return Object.fromEntries(Object.entries(s).map(([$,p])=>[$,Wn(p)]))});X(()=>{let s=()=>{let $=Nr();_(Object.fromEntries(Object.entries($).map(([p,g])=>[p,Wn(g)])))};return window.addEventListener("piclaw:keyboard-shortcuts-changed",s),()=>window.removeEventListener("piclaw:keyboard-shortcuts-changed",s)},[]);let c=D(()=>lr.filter((s)=>{let $=String(i[s.id]||"");return pl(n,s,$)}),[i,n]),u=(s)=>{let $=String(i[s]||"").trim(),g=($?$.split(/[\n,]/).map((x)=>x.trim()).filter(Boolean):[]).filter((x)=>!Cn(x));if(g.length>0){r?.(`Invalid shortcut: ${g[0]}. Escape is reserved and cannot be rebound.`,"error");return}let b=oc($);gc(s,b),_((x)=>({...x,[s]:Wn(or(s))})),r?.("Keyboard shortcuts saved.","success")},f=(s)=>{Hi(s),_(($)=>({...$,[s]:Wn(or(s))})),r?.("Keyboard shortcut reset to default.","success")};return l`
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
                <button class="settings-addon-btn" style="min-width:180px; height:40px; font-size:14px;" onClick=${()=>{Hi();let s=Nr();_(Object.fromEntries(Object.entries(s).map(([$,p])=>[$,Wn(p)]))),r?.("Keyboard shortcuts reset to defaults.","success")}}>Reset all to defaults</button>
            </div>

            <div class="settings-shortcut-list" style="display:grid; gap:16px;">
                ${c.map((s)=>l`
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
                                onInput=${($)=>_((p)=>({...p,[s.id]:$.target.value}))}
                                style="width:100%; min-height:46px; padding:10px 14px; font-size:16px; line-height:1.35; font-family:var(--font-mono, ui-monospace, monospace); border-radius:12px;"
                            />
                            <div class="settings-shortcut-actions" style="display:flex; justify-content:flex-end; align-items:center; gap:10px; flex-wrap:wrap;">
                                <button class="settings-addon-btn settings-addon-btn-install" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>u(s.id)}>Save</button>
                                <button class="settings-addon-btn" style="min-width:96px; height:40px; font-size:14px;" onClick=${()=>f(s.id)}>Default</button>
                            </div>
                        </div>
                    </div>
                `)}
                ${c.length===0&&l`<div class="settings-hint">No shortcuts match this filter.</div>`}
            </div>
        </div>
    `}var tc=Y(()=>{m();$c()});function xc(n,r=Li){let i=Number(n);if(!Number.isFinite(i))return r;return Math.min(300,Math.max(15,Math.round(i)))}function vc(n,r=Ni){let i=Number(n);if(!Number.isFinite(i))return r;return Math.min(8,Math.max(0,Math.round(i)))}function Vi(){return{refreshIntervalSec:xc(ki(yc,Li),Li),folderPreviewDepth:vc(ki(hc,Ni),Ni)}}function pc(n={}){let r=Vi(),i={refreshIntervalSec:xc(Object.prototype.hasOwnProperty.call(n,"refreshIntervalSec")?n.refreshIntervalSec:r.refreshIntervalSec,r.refreshIntervalSec),folderPreviewDepth:vc(Object.prototype.hasOwnProperty.call(n,"folderPreviewDepth")?n.folderPreviewDepth:r.folderPreviewDepth,r.folderPreviewDepth)};if(fn(yc,String(i.refreshIntervalSec)),fn(hc,String(i.folderPreviewDepth)),typeof window<"u")window.dispatchEvent(new CustomEvent(Kl,{detail:{settings:i}}));return i}var Kl="piclaw:workspace-client-settings-updated",yc="workspaceRefreshIntervalSec",hc="workspaceFolderPreviewDepth",Li=60,Ni=3;var bc=()=>{};var zc={};_n(zc,{WorkspaceSection:()=>zl});function Kc(n={}){let r=n.workspaceSettings||{};return{webTerminalEnabled:r.webTerminalEnabled!==!1,vncAllowDirect:r.vncAllowDirect!==!1,treeMaxDepth:r.treeMaxDepth??4,treeMaxEntries:r.treeMaxEntries??5000}}function zl({settingsData:n,setStatus:r,mergeSettingsData:i}){let[_,c]=w(!0),[u,f]=w(!0),[o,s]=w(4),[$,p]=w(5000),[g,b]=w(60),[x,v]=w(3),[F,y]=w(!1),[K,W]=w(!1),L=Z(""),B=Z(null),U=Z(null),z=Z(null),j=Z(!0);X(()=>{return j.current=!0,()=>{if(j.current=!1,B.current)clearTimeout(B.current);if(U.current)clearTimeout(U.current);if(z.current)clearTimeout(z.current)}},[]);let Q=T((k)=>{let h=Kc(k),H=Vi();c(h.webTerminalEnabled),f(h.vncAllowDirect),s(h.treeMaxDepth),p(h.treeMaxEntries),b(H.refreshIntervalSec),v(H.folderPreviewDepth),L.current=JSON.stringify(h)},[]);X(()=>{Q(n||{})},[n,Q]);let t=D(()=>JSON.stringify(Kc({workspaceSettings:{webTerminalEnabled:_,vncAllowDirect:u,treeMaxDepth:o,treeMaxEntries:$}})),[_,u,o,$]);X(()=>{if(t===L.current)return;if(B.current)clearTimeout(B.current);return B.current=setTimeout(async()=>{if(!j.current)return;let k=document.activeElement;if(k&&k.closest?.(".settings-number-stepper"))return;try{let h=await Ki(JSON.parse(t));if(!j.current||!h?.ok||!h?.settings)return;if(L.current=t,i?.({workspaceSettings:h.settings}),r?.(null),y(!0),U.current)clearTimeout(U.current);U.current=setTimeout(()=>{if(j.current)y(!1)},4000)}catch(h){r?.(String(h?.message||h),"error")}},800),()=>{if(B.current)clearTimeout(B.current)}},[t,i,r]);let G=T((k)=>{let h=pc(k);if(b(h.refreshIntervalSec),v(h.folderPreviewDepth),W(!0),z.current)clearTimeout(z.current);z.current=setTimeout(()=>{if(j.current)W(!1)},3000)},[]);return l`
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
                <input type="checkbox" checked=${_} onChange=${(k)=>c(k.target.checked)} />
            </div>
            <div class="settings-row">
                <label>Allow direct VNC targets</label>
                <input type="checkbox" checked=${u} onChange=${(k)=>f(k.target.checked)} />
            </div>
            <p class="settings-hint">Terminal access updates immediately. Direct VNC target policy applies to new VNC requests.</p>

            <h3 style="margin-top:20px">Server scan guardrails</h3>
            <div class="settings-row">
                <label>Max tree depth</label>
                <${e}
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
                <${e}
                    label="workspace tree max entries"
                    value=${$}
                    min=${250}
                    max=${5000}
                    step=${250}
                    fallback=${5000}
                    width="92px"
                    onChange=${p}
                />
                <span class="settings-hint" style="margin:0">truncate oversized tree walks earlier</span>
            </div>

            <h3 style="margin-top:20px">This browser</h3>
            <div class="settings-row">
                <label>Refresh interval (seconds)</label>
                <${e}
                    label="workspace refresh interval"
                    value=${g}
                    min=${15}
                    max=${300}
                    step=${15}
                    fallback=${60}
                    width="92px"
                    onChange=${(k)=>G({refreshIntervalSec:k})}
                />
            </div>
            <div class="settings-row">
                <label>Folder preview scan depth</label>
                <${e}
                    label="folder preview scan depth"
                    value=${x}
                    min=${0}
                    max=${8}
                    fallback=${3}
                    width="80px"
                    onChange=${(k)=>G({folderPreviewDepth:k})}
                />
                <span class="settings-hint" style="margin:0">set to <code>0</code> to disable folder size preview scans</span>
            </div>
            <p class="settings-hint">Root and folder-expansion tree loads remain shallow; the folder size preview is the deepest workspace scan in the UI.</p>
        </div>
    `}var Fc=Y(()=>{m();bn();bc();Yn()});var Bc={};_n(Bc,{EnvironmentSection:()=>Fl});function Pi(n={}){let r=n.environmentSettings||n.settings||n.environment||{};return{variables:Array.isArray(r.variables)?r.variables:[],overrides:r.overrides&&typeof r.overrides==="object"?r.overrides:{},count:Number(r.count||0),overrideCount:Number(r.overrideCount||0),keychainEnvNames:Array.isArray(r.keychainEnvNames)?r.keychainEnvNames:[]}}function Fl({settingsData:n,filter:r="",setStatus:i,mergeSettingsData:_}){let[c,u]=w(()=>Pi(n||{})),[f,o]=w({}),[s,$]=w(""),[p,g]=w(""),[b,x]=w(null);X(()=>{u(Pi(n||{})),o({})},[n]);let v=T((B)=>{let U=Pi({environmentSettings:B?.settings||B});return u(U),_?.({environmentSettings:U}),o({}),U},[_]),F=T(async()=>{try{let B=await zi();if(B?.ok)v(B.settings);i?.("Environment refreshed.","info")}catch(B){i?.(String(B?.message||B),"error")}},[v,i]),y=T(async(B,U)=>{let z=String(B||"").trim();if(!z)return;x(z);try{let j=await Tr({action:"set",name:z,value:String(U??"")});if(j?.ok)v(j.settings);if(i?.(`Saved environment override for ${z}.`,"info"),z===s.trim())$(""),g("")}catch(j){i?.(String(j?.message||j),"error")}finally{x(null)}},[v,s,i]),K=T(async(B)=>{let U=String(B||"").trim();if(!U)return;x(U);try{let z=await Tr({action:"clear",name:U});if(z?.ok)v(z.settings);i?.(`Cleared environment override for ${U}.`,"info")}catch(z){i?.(String(z?.message||z),"error")}finally{x(null)}},[v,i]),W=D(()=>{let B=String(r||"").trim().toLowerCase(),U=Array.isArray(c.variables)?c.variables:[];if(!B)return U;return U.filter((z)=>{return`${z?.name||""} ${z?.value||""} ${z?.source||""}`.toLowerCase().includes(B)})},[c.variables,r]),L=T((B,U)=>{o((z)=>({...z||{},[B]:U}))},[]);return l`
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
                        onInput=${(B)=>$(B.target.value)}
                    />
                    <input
                        type="text"
                        value=${p}
                        placeholder="value"
                        spellcheck="false"
                        onInput=${(B)=>g(B.target.value)}
                    />
                    <button
                        type="button"
                        disabled=${!s.trim()||b===s.trim()}
                        onClick=${()=>y(s,p)}
                    >Save</button>
                </div>
            </div>

            <p class="settings-hint">
                ${c.count} variables visible • ${c.overrideCount} overrides active • ${c.keychainEnvNames.length} keychain-injected variables hidden
            </p>

            <div class="settings-tool-list" style="max-height:58vh; overflow:auto;">
                ${W.map((B)=>{let U=String(B?.name||""),z=Object.prototype.hasOwnProperty.call(f,U)?f[U]:B.value,j=z!==B.value,Q=b===U;return l`
                        <div class="settings-tool-row" key=${U} style="grid-template-columns:minmax(180px,0.45fr) minmax(240px,1fr) auto auto; align-items:center;">
                            <span class="settings-tool-name" title=${U}>${U}</span>
                            <input
                                type="text"
                                value=${z}
                                spellcheck="false"
                                onInput=${(t)=>L(U,t.target.value)}
                                style="min-width:0; width:100%; font-family:var(--font-mono, monospace);"
                            />
                            <span class="settings-tool-kind" title=${B.overridden?"Overridden in KV":"Inherited from process environment"}>
                                ${B.overridden?"override":"process"}
                            </span>
                            <span style="display:flex; gap:6px; justify-content:flex-end;">
                                <button type="button" disabled=${Q||!j} onClick=${()=>y(U,z)}>Save</button>
                                <button type="button" disabled=${Q||!B.overridden} onClick=${()=>K(U)}>Clear</button>
                            </span>
                        </div>
                    `})}
                ${W.length===0&&l`<p class="settings-hint">No environment variables match "${r}".</p>`}
            </div>
        </div>
    `}var kc=Y(()=>{m();bn()});var Wc={};_n(Wc,{ProvidersSection:()=>kl});function Bl(n){switch(n){case"oauth":return"OAuth";case"api_key":return"API key";case"custom":return"Configured";default:return"Configured"}}function kl({providers:n,setStatus:r}){let[i,_]=w(null),[c,u]=w(null),[f,o]=w({}),s=T((y,K)=>{o((W)=>({...W,[y]:K}))},[]),$=T(async(y)=>{let K=(f.apiKey||"").trim();if(!K){r?.("API key cannot be empty.","error");return}_(y),r?.(`Configuring ${y}…`,"info");try{let W=JSON.stringify({provider:y,method:"api_key",api_key:K}),L=await pn("default",`/login __step2 ${W}`,null,[]);if(L?.command?.status==="error"){r?.(L.command.message,"error");return}r?.(L?.command?.message||`${y} configured.`,"success"),u(null),o({})}catch(W){r?.(String(W.message||W),"error")}finally{_(null)}},[f,r]),p=T(async(y,K)=>{_(y),r?.(`Configuring ${y}…`,"info");try{let W={provider:y,method:"custom"};for(let U of K.customFields||[])W[U.key]=(f[U.key]||"").trim();let L=JSON.stringify(W),B=await pn("default",`/login __step2 ${L}`,null,[]);if(B?.command?.status==="error"){r?.(B.command.message,"error");return}r?.(B?.command?.message||`${y} configured.`,"success"),u(null),o({})}catch(W){r?.(String(W.message||W),"error")}finally{_(null)}},[f,r]),g=T(async(y)=>{_(y),r?.(`Starting OAuth for ${y}…`,"info");try{let K=JSON.stringify({provider:y}),L=(await pn("default",`/login __step1 ${K}`,null,[]))?.command?.message||"";if(L.includes("http")){let B=L.match(/(https?:\/\/[^\s)]+)/);if(B)window.open(B[1],"_blank","noopener"),r?.("OAuth window opened. Complete the sign-in flow, then close this message.","success");else r?.(L,"success")}else r?.(L||`OAuth flow started for ${y}. Check the chat.`,"success")}catch(K){r?.(String(K.message||K),"error")}finally{_(null)}},[r]),b=T(async(y)=>{if(i)return;_(y),r?.(`Logging out ${y}…`,"info");try{await pn("default",`/logout ${y}`,null,[]),r?.(`Logged out ${y}. Restart may be needed.`,"success")}catch(K){r?.(String(K.message||K),"error")}finally{_(null)}},[i,r]),x=n||[],v=(y)=>c===y,F=(y)=>{u((K)=>K===y?null:y),o({})};return l`
        <div class="settings-section">
            <h3>Providers</h3>
            <div class="settings-provider-list">
                ${x.map((y)=>l`
                    <div class=${`settings-provider-card${y.configured?" configured":""}`}>
                        <div class="settings-provider-card-header" onClick=${()=>!y.configured&&F(y.id)}>
                            <div class="settings-provider-card-title">
                                <strong>${y.name}</strong>
                                <span class="settings-provider-id">${y.id}</span>
                                ${y.configured&&l`<span class="settings-tag settings-tag-skill">${Bl(y.authType)}</span>`}
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

                        ${v(y.id)&&l`
                            <div class="settings-provider-setup">
                                <p class="settings-hint settings-provider-setup-hint">Sign-in flows open in the browser. In narrow panes the setup form stacks vertically to avoid clipping.</p>
                                ${y.hasOAuth&&l`
                                    <div class="settings-provider-method">
                                        <button class="settings-addon-btn settings-addon-btn-install"
                                            disabled=${i===y.id}
                                            onClick=${()=>g(y.id)}>
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
                                                onClick=${()=>$(y.id)}>
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
                                                    onInput=${(W)=>s(K.key,W.target.value)}
                                                    placeholder=${K.placeholder||""} />
                                            </div>
                                        `)}
                                        <div class="settings-provider-form-actions">
                                            <button class="settings-addon-btn settings-addon-btn-install"
                                                disabled=${i===y.id}
                                                onClick=${()=>p(y.id,y)}>
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
    `}var jc=Y(()=>{m();bn()});var Rc={};_n(Rc,{ModelsSection:()=>Ul});function Rl(n){return typeof n==="string"&&n.toLowerCase()==="anthropic"}function Tl({thinkingLevel:n,supportsThinking:r,provider:i,availableLevels:_,onSetLevel:c,disabled:u}){let f=Rl(i)?Wl:jl,o=_&&_.length>1?_:["off","minimal","low","medium","high"],s=Math.max(0,o.indexOf(n??"off"));if(!r)return l`<div class="settings-thinking-slider"><label>Thinking level</label><p class="settings-hint" style="margin:4px 0 0">Current model does not support thinking.</p></div>`;return l`
        <div class="settings-thinking-slider">
            <label>Thinking level: <strong>${f[o[s]]||o[s]}</strong></label>
            <div class="settings-slider-track">
                <input type="range" min="0" max=${o.length-1} step="1" value=${s} disabled=${u}
                    onInput=${($)=>c(o[parseInt($.target.value,10)])} />
                <div class="settings-slider-labels">
                    ${o.map(($,p)=>l`<span class=${p===s?"active":""} onClick=${()=>!u&&c($)}>${f[$]||$}</span>`)}
                </div>
            </div>
        </div>
    `}function Ul({filter:n=""}){let[r,i]=w(null),[_,c]=w(!1),[u,f]=w("off"),[o,s]=w(!1),[$,p]=w(["off"]),[g,b]=w(!1),[x,v]=w(!1),[F,y]=w(!1),K=T(async()=>{let k=await Fi();if(i(k),k.thinking_level)f(k.thinking_level);if(s(Boolean(k.supports_thinking)),b(Boolean(k.scoped_models_only)),Array.isArray(k.available_thinking_levels)&&k.available_thinking_levels.length>0)p(k.available_thinking_levels);return k},[]);X(()=>{K().catch((k)=>{console.warn("[settings/models] Failed to load models.",k),i({models:[],model_options:[]})})},[]);let W=T(async(k)=>{if(_)return;c(!0);try{await pn("default",`/model ${k}`,null,[]),await K()}catch(h){console.error("Failed to switch model:",h)}finally{c(!1)}},[_,K]),L=T(async(k)=>{if(x)return;v(!0),b(Boolean(k));try{let h=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scopedModelsOnly:Boolean(k)})}),H=await h.json().catch(()=>({}));if(!h.ok||!H?.ok)throw Error(H?.error||"Failed to save scoped model setting.");await K()}catch(h){console.error("Failed to set scoped model filtering:",h),await K().catch((H)=>{console.warn("[settings/models] Reload after scoped model filtering failure failed.",H)})}finally{v(!1)}},[x,K]),B=T(async(k)=>{if(F)return;y(!0),f(k);try{let h=await pn("default",`/thinking ${k}`,null,[]);if(h?.command?.thinking_level)f(h.command.thinking_level);s(h?.command?.supports_thinking!==!1),await K()}catch(h){console.error("Failed to set thinking:",h),await K().catch((H)=>{console.warn("[settings/models] Reload after thinking change failure failed.",H)})}finally{y(!1)}},[F,K]);if(!r)return l`<div class="settings-loading">Loading models\u2026</div>`;let U=r.model_options||[],z=r.current,Q=U.find((k)=>k.label===z)?.provider||"",t=n.toLowerCase(),G=t?U.filter((k)=>k.label.toLowerCase().includes(t)||(k.provider||"").toLowerCase().includes(t)):U;return l`
        <div class="settings-models-split">
            <div class="settings-models-summary settings-hint">Model and provider names may wrap in narrow panes to avoid clipping.</div>
            <div class="settings-row" style="padding:0 0 10px 0; align-items:flex-start">
                <label>Scoped models only</label>
                <div style="display:flex; flex-direction:column; gap:4px; min-width:0">
                    <label style="display:flex; align-items:center; gap:8px; font-weight:500">
                        <input type="checkbox" checked=${g} disabled=${x} onChange=${(k)=>L(k.target.checked)} />
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
                        ${G.map((k)=>l`
                            <tr class=${k.label===z?"settings-row-active":""}>
                                <td><input type="radio" name="settings-model" checked=${k.label===z} disabled=${_} onChange=${()=>W(k.label)} /></td>
                                <td>${k.name||k.label}</td><td>${k.provider}</td>
                                <td>${k.context_window?(k.context_window/1000).toFixed(0)+"K":"—"}</td>
                                <td style="text-align:center">${k.reasoning?"\uD83E\uDDE0":"—"}</td>
                            </tr>
                        `)}
                        ${G.length===0&&l`<tr><td colspan="5" class="settings-empty">No models match "${n}"</td></tr>`}
                    </tbody>
                </table>
            </div>
            <div class="settings-models-footer">
                <${Tl}
                    thinkingLevel=${u}
                    supportsThinking=${o}
                    provider=${Q}
                    availableLevels=${$}
                    onSetLevel=${B}
                    disabled=${F||_} />
            </div>
        </div>
    `}var Wl,jl;var Tc=Y(()=>{m();bn();Wl={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"max"},jl={off:"off",minimal:"minimal",low:"low",medium:"medium",high:"high",xhigh:"xhigh"}});function Ai(n){let r=String(n||"").trim().toLowerCase();if(!r)return"default";if(r==="solarized-dark"||r==="solarized-light")return"solarized";if(r==="github-dark"||r==="github-light")return"github";if(r==="tokyo-night")return"tokyo";return r}function Lc(n){if(!n)return null;let r=String(n).trim();if(!r)return null;let i=r.startsWith("#")?r.slice(1):r;if(!/^[0-9a-fA-F]{3}$/.test(i)&&!/^[0-9a-fA-F]{6}$/.test(i))return null;let _=i.length===3?i.split("").map((u)=>u+u).join(""):i,c=parseInt(_,16);return{r:c>>16&255,g:c>>8&255,b:c&255,hex:`#${_.toLowerCase()}`}}function Hl(n,r){try{if(document.body){n.style.display="none",document.body.appendChild(n);let i=getComputedStyle(n).color||n.style.color;return document.body.removeChild(n),i}}catch{return r}return r}function Ll(n){if(!n||typeof document>"u")return null;let r=String(n).trim();if(!r)return null;let i=document.createElement("div");if(i.style.color="",i.style.color=r,!i.style.color)return null;let c=Hl(i,i.style.color).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!c)return null;let u=parseInt(c[1],10),f=parseInt(c[2],10),o=parseInt(c[3],10);if(![u,f,o].every(($)=>Number.isFinite($)))return null;let s=`#${[u,f,o].map(($)=>$.toString(16).padStart(2,"0")).join("")}`;return{r:u,g:f,b:o,hex:s}}function Ln(n){return Lc(n)||Ll(n)}function Mi(n,r,i){let _=Math.round(n.r+(r.r-n.r)*i),c=Math.round(n.g+(r.g-n.g)*i),u=Math.round(n.b+(r.b-n.b)*i);return`rgb(${_} ${c} ${u})`}function Vr(n,r){return`rgba(${n.r}, ${n.g}, ${n.b}, ${r})`}function Nl(n){let r=n.r/255,i=n.g/255,_=n.b/255,c=r<=0.03928?r/12.92:Math.pow((r+0.055)/1.055,2.4),u=i<=0.03928?i/12.92:Math.pow((i+0.055)/1.055,2.4),f=_<=0.03928?_/12.92:Math.pow((_+0.055)/1.055,2.4);return 0.2126*c+0.7152*u+0.0722*f}function Vl(n){return Nl(n)>0.4?"#000000":"#ffffff"}function Nc(){if(typeof window>"u")return"light";try{return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch{return"light"}}function qi(n){return Uc[n]||Uc.default}function Pl(n){return n.mode==="auto"?Nc():n.mode}function Vc(n,r){let i=qi(n);if(r==="dark"&&i.dark)return i.dark;if(r==="light"&&i.light)return i.light;return i.dark||i.light||zn}function Kn(n,r,i){let _=Ln(n);if(!_)return n;return Mi(_,r,i)}function Pc(n,r,i){let _=Ln(r);if(!_)return n;let u=Lc(i==="dark"?"#ffffff":"#000000");return{...n,bgPrimary:Kn(n.bgPrimary,_,0.08),bgSecondary:Kn(n.bgSecondary,_,0.12),bgHover:Kn(n.bgHover,_,0.16),textPrimary:Kn(n.textPrimary,_,i==="dark"?0.08:0.06),textSecondary:Kn(n.textSecondary,_,i==="dark"?0.12:0.1),borderColor:Kn(n.borderColor,_,0.1),accent:_.hex,accentHover:u?Mi(_,u,0.18):_.hex,warning:Kn(n.warning||zn.warning,_,0.14),danger:Kn(n.danger,_,0.16),success:Kn(n.success,_,0.16)}}function Xl(n,r){let i=Ln(n?.warning);if(i)return i.hex;let _=Ln(r==="dark"?Qr.warning:zn.warning)||Ln(zn.warning),c=Ln(n?.accent);if(_&&c)return Mi(_,c,r==="dark"?0.18:0.14);return r==="dark"?Qr.warning:zn.warning}function Ql(n,r){if(typeof document>"u")return;let i=document.documentElement,_=n.accent,c=Ln(_),u=c?Vr(c,r==="dark"?0.35:0.2):n.searchHighlight||n.searchHighlightColor,f=c?Vr(c,r==="dark"?0.16:0.12):"rgba(29, 155, 240, 0.12)",o=c?Vr(c,r==="dark"?0.28:0.2):"rgba(29, 155, 240, 0.2)",s=c?Vl(c):r==="dark"?"#000000":"#ffffff",$=c?Vr(c,r==="dark"?0.35:0.25):"rgba(29, 155, 240, 0.25)",p=Xl(n,r),g={"--bg-primary":n.bgPrimary,"--bg-secondary":n.bgSecondary,"--bg-hover":n.bgHover,"--text-primary":n.textPrimary,"--text-secondary":n.textSecondary,"--border-color":n.borderColor,"--accent-color":_,"--accent-hover":n.accentHover||_,"--accent-color-alpha":$,"--accent-soft":f,"--accent-soft-strong":o,"--accent-contrast-text":s,"--warning-color":p,"--danger-color":n.danger||zn.danger,"--success-color":n.success||zn.success,"--search-highlight-color":u||"rgba(29, 155, 240, 0.2)"};Object.entries(g).forEach(([b,x])=>{if(x)i.style.setProperty(b,x)})}function Al(){if(typeof document>"u")return;let n=document.documentElement;Gl.forEach((r)=>n.style.removeProperty(r))}function On(n,r={}){if(typeof document>"u")return null;let i=typeof r.id==="string"&&r.id.trim()?r.id.trim():null,_=i?document.getElementById(i):document.querySelector(`meta[name="${n}"]`);if(!_)_=document.createElement("meta"),document.head.appendChild(_);if(_.setAttribute("name",n),i)_.setAttribute("id",i);return _}function Gc(n){let r=Ai(Nn?.theme||"default"),i=Nn?.tint?String(Nn.tint).trim():null,_=Vc(r,n);if(r==="default"&&i)_=Pc(_,i,n);if(_?.bgPrimary)return _.bgPrimary;return n==="dark"?Qr.bgPrimary:zn.bgPrimary}function Ml(n,r){if(typeof document>"u")return;let i=On("theme-color",{id:"dynamic-theme-color"});if(i&&n)i.removeAttribute("media"),i.setAttribute("content",n);let _=On("theme-color",{id:"theme-color-light"});if(_)_.setAttribute("media","(prefers-color-scheme: light)"),_.setAttribute("content",Gc("light"));let c=On("theme-color",{id:"theme-color-dark"});if(c)c.setAttribute("media","(prefers-color-scheme: dark)"),c.setAttribute("content",Gc("dark"));let u=On("msapplication-TileColor");if(u&&n)u.setAttribute("content",n);let f=On("msapplication-navbutton-color");if(f&&n)f.setAttribute("content",n);let o=On("apple-mobile-web-app-status-bar-style");if(o)o.setAttribute("content",r==="dark"?"black-translucent":"default")}function ql(){if(typeof window>"u")return;let n={...Nn,mode:Hc};window.dispatchEvent(new CustomEvent("piclaw-theme-change",{detail:n}))}function Dl(){if(typeof window>"u")return"web:default";try{let r=new URL(window.location.href).searchParams.get("chat_jid");return r&&r.trim()?r.trim():"web:default"}catch{return"web:default"}}function Zl(n){if(typeof document>"u"||!n)return;let r=document.documentElement;if(r?.style)r.style.background=n;if(document.body?.style)document.body.style.background=n}function Di(n,r={}){if(typeof window>"u"||typeof document>"u")return;let i=Ai(n?.theme||"default"),_=n?.tint?String(n.tint).trim():null,c=qi(i),u=Pl(c),f=Vc(i,u);Nn={theme:i,tint:_},Hc=u;let o=document.documentElement;o.dataset.theme=u,o.dataset.colorTheme=i,o.dataset.tint=_?String(_):"",o.style.colorScheme=u;let s=f;if(i==="default"&&_)s=Pc(f,_,u);if(i==="default"&&!_)Al();else Ql(s,u);if(Zl(s.bgPrimary),Ml(s.bgPrimary,u),ql(),r.persist!==!1)if(fn(Qi,i),_)fn(Xr,_);else fn(Xr,"")}function Pr(){if(qi(Nn.theme).mode!=="auto")return;Di(Nn,{persist:!1})}function Il(){if(typeof window>"u")return;let n=Ai(Zn(Qi)||"default"),r=(()=>{let i=Zn(Xr);return i?i.trim():null})();Di({theme:n,tint:r},{persist:!1})}function So(){if(typeof window>"u")return()=>{};if(Il(),window.matchMedia&&!Xi){let n=window.matchMedia("(prefers-color-scheme: dark)");if(n.addEventListener)n.addEventListener("change",Pr);else if(n.addListener)n.addListener(Pr);return Xi=!0,()=>{if(n.removeEventListener)n.removeEventListener("change",Pr);else if(n.removeListener)n.removeListener(Pr);Xi=!1}}return()=>{}}function Zi(n){if(!n||typeof n!=="object")return;let r=Dl(),i=n.chat_jid||n.chatJid||null,_=n.theme??n.name??n.colorTheme,c=n.tint??null;if(!i||i===r)Di({theme:_||"default",tint:c},{persist:!1});fn(Qi,_||"default"),fn(Xr,c||"")}function eo(){if(typeof document>"u")return"light";let n=document.documentElement?.dataset?.theme;if(n==="dark"||n==="light")return n;return Nc()}var Qi="piclaw_theme",Xr="piclaw_tint",zn,Qr,Uc,Gl,Nn,Hc="light",Xi=!1;var Xc=Y(()=>{zn={bgPrimary:"#ffffff",bgSecondary:"#f7f9fa",bgHover:"#e8ebed",textPrimary:"#0f1419",textSecondary:"#536471",borderColor:"#eff3f4",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},Qr={bgPrimary:"#000000",bgSecondary:"#16181c",bgHover:"#1d1f23",textPrimary:"#e7e9ea",textSecondary:"#71767b",borderColor:"#2f3336",accent:"#1d9bf0",accentHover:"#1a8cd8",warning:"#f0b429",danger:"#f4212e",success:"#00ba7c"},Uc={default:{label:"Default",mode:"auto",light:zn,dark:Qr},tango:{label:"Tango",mode:"light",light:{bgPrimary:"#f6f5f4",bgSecondary:"#efedeb",bgHover:"#e5e3e1",textPrimary:"#2e3436",textSecondary:"#5c6466",borderColor:"#d3d7cf",accent:"#3465a4",accentHover:"#2c5890",danger:"#cc0000",success:"#4e9a06"}},xterm:{label:"XTerm",mode:"dark",dark:{bgPrimary:"#000000",bgSecondary:"#0a0a0a",bgHover:"#121212",textPrimary:"#d0d0d0",textSecondary:"#8a8a8a",borderColor:"#1f1f1f",accent:"#00a2ff",accentHover:"#0086d1",danger:"#ff5f5f",success:"#5fff87"}},monokai:{label:"Monokai",mode:"dark",dark:{bgPrimary:"#272822",bgSecondary:"#2f2f2f",bgHover:"#3a3a3a",textPrimary:"#f8f8f2",textSecondary:"#cfcfc2",borderColor:"#3e3d32",accent:"#f92672",accentHover:"#e81560",danger:"#f92672",success:"#a6e22e"}},"monokai-pro":{label:"Monokai Pro",mode:"dark",dark:{bgPrimary:"#2d2a2e",bgSecondary:"#363237",bgHover:"#403a40",textPrimary:"#fcfcfa",textSecondary:"#c1c0c0",borderColor:"#444046",accent:"#ff6188",accentHover:"#f74f7e",danger:"#ff4f5e",success:"#a9dc76"}},ristretto:{label:"Ristretto",mode:"dark",dark:{bgPrimary:"#2c2525",bgSecondary:"#362d2d",bgHover:"#403535",textPrimary:"#f4f1ef",textSecondary:"#cbbdb8",borderColor:"#4a3c3c",accent:"#ff9f43",accentHover:"#f28a2e",danger:"#ff5f56",success:"#a9dc76"}},dracula:{label:"Dracula",mode:"dark",dark:{bgPrimary:"#282a36",bgSecondary:"#303445",bgHover:"#3a3f52",textPrimary:"#f8f8f2",textSecondary:"#c5c8d6",borderColor:"#44475a",accent:"#bd93f9",accentHover:"#a87ded",danger:"#ff5555",success:"#50fa7b"}},catppuccin:{label:"Catppuccin",mode:"dark",dark:{bgPrimary:"#1e1e2e",bgSecondary:"#24273a",bgHover:"#2c2f41",textPrimary:"#cdd6f4",textSecondary:"#a6adc8",borderColor:"#313244",accent:"#89b4fa",accentHover:"#74a0f5",danger:"#f38ba8",success:"#a6e3a1"}},nord:{label:"Nord",mode:"dark",dark:{bgPrimary:"#2e3440",bgSecondary:"#3b4252",bgHover:"#434c5e",textPrimary:"#eceff4",textSecondary:"#d8dee9",borderColor:"#4c566a",accent:"#88c0d0",accentHover:"#78a9c0",danger:"#bf616a",success:"#a3be8c"}},gruvbox:{label:"Gruvbox",mode:"dark",dark:{bgPrimary:"#282828",bgSecondary:"#32302f",bgHover:"#3c3836",textPrimary:"#ebdbb2",textSecondary:"#bdae93",borderColor:"#3c3836",accent:"#d79921",accentHover:"#c28515",danger:"#fb4934",success:"#b8bb26"}},solarized:{label:"Solarized",mode:"auto",light:{bgPrimary:"#fdf6e3",bgSecondary:"#f5efdc",bgHover:"#eee8d5",textPrimary:"#586e75",textSecondary:"#657b83",borderColor:"#e0d8c6",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"},dark:{bgPrimary:"#002b36",bgSecondary:"#073642",bgHover:"#0b3c4a",textPrimary:"#eee8d5",textSecondary:"#93a1a1",borderColor:"#18424a",accent:"#268bd2",accentHover:"#1f78b3",danger:"#dc322f",success:"#859900"}},tokyo:{label:"Tokyo",mode:"dark",dark:{bgPrimary:"#1a1b26",bgSecondary:"#24283b",bgHover:"#2f3549",textPrimary:"#c0caf5",textSecondary:"#9aa5ce",borderColor:"#414868",accent:"#7aa2f7",accentHover:"#6b92e6",danger:"#f7768e",success:"#9ece6a"}},miasma:{label:"Miasma",mode:"dark",dark:{bgPrimary:"#1f1f23",bgSecondary:"#29292f",bgHover:"#33333a",textPrimary:"#e5e5e5",textSecondary:"#b4b4b4",borderColor:"#3d3d45",accent:"#c9739c",accentHover:"#b8618c",danger:"#e06c75",success:"#98c379"}},github:{label:"GitHub",mode:"auto",light:{bgPrimary:"#ffffff",bgSecondary:"#f6f8fa",bgHover:"#eaeef2",textPrimary:"#24292f",textSecondary:"#57606a",borderColor:"#d0d7de",accent:"#0969da",accentHover:"#0550ae",danger:"#cf222e",success:"#1a7f37"},dark:{bgPrimary:"#0d1117",bgSecondary:"#161b22",bgHover:"#21262d",textPrimary:"#c9d1d9",textSecondary:"#8b949e",borderColor:"#30363d",accent:"#2f81f7",accentHover:"#1f6feb",danger:"#f85149",success:"#3fb950"}},gotham:{label:"Gotham",mode:"dark",dark:{bgPrimary:"#0b0f14",bgSecondary:"#111720",bgHover:"#18212b",textPrimary:"#cbd6e2",textSecondary:"#9bb0c3",borderColor:"#1f2a37",accent:"#5ccfe6",accentHover:"#48b8ce",danger:"#d26937",success:"#2aa889"}}},Gl=["--bg-primary","--bg-secondary","--bg-hover","--text-primary","--text-secondary","--border-color","--accent-color","--accent-hover","--accent-color-alpha","--accent-contrast-text","--accent-soft","--accent-soft-strong","--warning-color","--danger-color","--success-color","--search-highlight-color"],Nn={theme:"default",tint:null}});var Ac={};_n(Ac,{ThemeSection:()=>Yl});function Qc(n={}){return{uiTheme:typeof n.uiTheme==="string"&&n.uiTheme.trim()?n.uiTheme.trim():"default",uiTint:typeof n.uiTint==="string"&&n.uiTint.trim()?n.uiTint.trim():""}}function Yl({themes:n,colorKeys:r,settingsData:i,setStatus:_,mergeSettingsData:c}){let[u,f]=w("default"),[o,s]=w(""),[$,p]=w(!1),g=Z(""),b=Z(null),x=Z(!0);X(()=>{return x.current=!0,()=>{x.current=!1}},[]);let v=T((L)=>{let B=Qc(L);f(B.uiTheme),s(B.uiTint),g.current=JSON.stringify(B)},[]);X(()=>{if(i){v(i);return}v({uiTheme:document.documentElement.dataset.colorTheme||"default",uiTint:document.documentElement.dataset.tint||""})},[i,v]);let F=T((L,B)=>{Zi({theme:L,tint:B||null}),f(L||"default"),s(B||"")},[]),y=D(()=>JSON.stringify(Qc({uiTheme:u,uiTint:o})),[u,o]);X(()=>{if(y===g.current)return;if(b.current)clearTimeout(b.current);return b.current=setTimeout(async()=>{if(!x.current)return;p(!0);try{let L=await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:y}),B=await L.json().catch(()=>({}));if(!x.current)return;if(!L.ok||!B?.ok||!B?.settings){_?.(B?.error||"Failed to save appearance settings.","error");return}g.current=y,c?.(B.settings),_?.("Appearance synced across clients.","success")}catch(L){if(!x.current)return;console.warn("[settings/appearance] Failed to persist appearance settings.",L),_?.("Failed to save appearance settings.","error")}finally{if(x.current)p(!1)}},250),()=>{if(b.current)clearTimeout(b.current)}},[y,c,_]);let K=r||[],W=n||[];return l`
        <div class="settings-section">
            ${$&&l`<div class="settings-hint" style="margin:0 0 12px 0;">Syncing appearance…</div>`}
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
                        onInput=${(L)=>{let B=L.target.value;if(s(B),u==="default")Zi({theme:"default",tint:B})}} />
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
                    ${W.filter((L)=>L.name!=="default").map((L)=>l`
                        <tr class=${L.name===u?"settings-row-active":""}
                            style="cursor:pointer" onClick=${()=>F(L.name,"")}>
                            <td><input type="radio" name="settings-theme" checked=${L.name===u} onChange=${()=>F(L.name,"")} /></td>
                            <td><strong>${L.label}</strong></td>
                            <td>${L.mode}</td>
                            ${K.map((B)=>{let U=L.colors?.[B];return l`<td class="settings-swatch-cell">
                                    ${U?l`<span class="settings-color-swatch" style=${"background:"+U} title=${U}></span>`:"—"}
                                </td>`})}
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `}var Mc=Y(()=>{m();Xc()});var Dc={};_n(Dc,{__scheduledTasksSettingsTest:()=>Sl,ScheduledTasksSection:()=>dl});function Vn(n){if(!n)return"—";let r=new Date(n);if(Number.isNaN(r.getTime()))return n;return r.toLocaleString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function qc(n){let r=Number(n);if(!Number.isFinite(r))return"—";if(r<1000)return`${Math.round(r)}ms`;return`${(r/1000).toFixed(r<1e4?1:0)}s`}function Ii(n){if(!n)return"—";if(n.schedule_type==="once")return`once · ${Vn(n.schedule_value)}`;if(n.schedule_type==="interval")return`interval · ${n.schedule_value}`;if(n.schedule_type==="cron")return`cron · ${n.schedule_value}`;return`${n.schedule_type||"schedule"} · ${n.schedule_value||"—"}`}function Yi(n){let r=n?.task_kind||"agent";return r==="internal"?"internal/protected":r}function Ci(n){return(n?.task_kind||"agent")==="internal"}function Ol(n){if(!n)return"";let r=String(n).replace(/\s+/g," ").trim();return r.length>180?`${r.slice(0,179)}…`:r}function Jn({children:n,type:r="neutral"}){return l`<span class=${`settings-task-pill settings-task-pill-${r}`}>${n}</span>`}function Jl({task:n}){let r=Array.isArray(n?.recent_run_logs)?n.recent_run_logs:[];if(!r.length)return l`<p class="settings-hint">No run logs recorded yet.</p>`;return l`
        <div class="settings-task-run-list">
            ${r.map((i)=>l`
                <div class=${`settings-task-run-row settings-task-run-${i.status||"unknown"}`}>
                    <div class="settings-task-run-meta">
                        <${Jn} type=${i.status==="error"?"error":"success"}>${i.status||"unknown"}<//>
                        <span>${Vn(i.run_at)}</span>
                        <span>${qc(i.duration_ms)}</span>
                    </div>
                    <div class="settings-task-run-summary">
                        ${i.error_summary||Ol(i.error)||i.result_summary||i.result||"No summary"}
                    </div>
                </div>
            `)}
        </div>
    `}function El({task:n,onAction:r}){if(!n)return l`<div class="settings-task-detail-empty">Select a task to inspect schedule, status, and run history.</div>`;let i=Ci(n);return l`
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
                <span>Schedule</span><strong>${Ii(n)}</strong>
                <span>Next run</span><strong>${Vn(n.next_run)}</strong>
                <span>Last run</span><strong>${Vn(n.last_run)}</strong>
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
            <${Jl} task=${n} />
        </div>
    `}function dl({filter:n="",setStatus:r}){let[i,_]=w([]),[c,u]=w({active:0,paused:0,completed:0}),[f,o]=w("all"),[s,$]=w(""),[p,g]=w(!0),[b,x]=w(null),[v,F]=w(null),[y,K]=w(null),[W,L]=w(!1),B=T(async(t={})=>{g(!0),x(null);try{let G=await oi({status:f,chatJid:s.trim()||void 0,limit:50,includeRunLogs:!0,runLogLimit:5});_(G.tasks||[]),u(G.counts||{active:0,paused:0,completed:0});let k=t.selectedId||v,h=(G.tasks||[]).find((H)=>H.id===k)||(G.tasks||[])[0]||null;F(h?.id||null),K(h)}catch(G){x(G?.message||"Failed to load scheduled tasks.")}finally{g(!1)}},[f,s,v]);X(()=>{B()},[B]);let U=String(n||"").trim().toLowerCase(),z=D(()=>{if(!U)return i;return i.filter((t)=>[t.id,t.chat_jid,t.status,t.task_kind,t.schedule_type,t.schedule_value,t.summary,t.prompt_summary,t.command_summary,t.latest_run_log?.error_summary].some((G)=>String(G||"").toLowerCase().includes(U)))},[i,U]),j=T((t)=>{F(t?.id||null),K(t||null)},[]),Q=T(async(t,G)=>{if(!G||W)return;let k=Ci(G),h=G.summary||G.command_summary||G.prompt_summary||G.id,H=t==="delete"?`Delete scheduled task ${G.id}?

${h}`:`${t==="pause"?"Pause":"Resume"} scheduled task ${G.id}?

${h}`;if(!window.confirm(H))return;if(k&&!window.confirm(`Task ${G.id} is internal/protected. Continue with ${t}?`))return;L(!0),r?.(`${t==="delete"?"Deleting":t==="pause"?"Pausing":"Resuming"} ${G.id}…`,"info");try{await si(t,G.id,{allowInternal:k}),r?.(`Scheduled task ${G.id} ${t==="delete"?"deleted":t==="pause"?"paused":"resumed"}.`,"success"),await B({selectedId:t==="delete"?null:G.id})}catch(A){r?.(A?.message||`Failed to ${t} task.`,"error")}finally{L(!1)}},[W,B,r]);return l`
        <div class="settings-section settings-scheduled-tasks-section">
            <div class="settings-task-toolbar">
                <div class="settings-task-counts">
                    <${Jn} type="active">Active ${c.active||0}<//>
                    <${Jn} type="paused">Paused ${c.paused||0}<//>
                    <${Jn} type="completed">Completed ${c.completed||0}<//>
                </div>
                <div class="settings-task-filters">
                    <select value=${f} onChange=${(t)=>o(t.target.value)}>
                        ${Cl.map((t)=>l`<option value=${t}>${t==="all"?"All statuses":t}</option>`)}
                    </select>
                    <input type="text" placeholder="Filter chat JID…" value=${s} onInput=${(t)=>$(t.target.value)} />
                    <button onClick=${()=>B()} disabled=${p}>Refresh</button>
                </div>
            </div>

            ${p&&l`<div class="settings-loading settings-loading-pane"><span class="settings-spinner"></span><span>Loading scheduled tasks…</span></div>`}
            ${b&&l`<div class="settings-error-state">${b}</div>`}
            ${!p&&!b&&i.length===0&&l`
                <div class="settings-empty-state">
                    <strong>No scheduled tasks found.</strong>
                    <p>Tasks created with reminders, `/i`, or the scheduler tool will appear here.</p>
                </div>
            `}
            ${!p&&!b&&i.length>0&&l`
                <div class="settings-task-layout">
                    <div class="settings-task-list" role="listbox" aria-label="Scheduled tasks">
                        ${z.map((t)=>l`
                            <button class=${`settings-task-row ${t.id===v?"active":""}`} onClick=${()=>j(t)}>
                                <span class="settings-task-row-main">
                                    <strong>${t.summary||t.id}</strong>
                                    <span>${Ii(t)}</span>
                                </span>
                                <span class="settings-task-row-meta">
                                    <${Jn} type=${t.status||"neutral"}>${t.status}<//>
                                    <${Jn}>${Yi(t)}<//>
                                </span>
                                <span class="settings-task-row-times">Next ${Vn(t.next_run)} · Last ${Vn(t.last_run)}${t.latest_run_log?.status?` · ${t.latest_run_log.status}`:""}</span>
                            </button>
                        `)}
                        ${z.length===0&&l`<p class="settings-hint">No tasks match “${n}”.</p>`}
                    </div>
                    <${El} task=${y&&z.some((t)=>t.id===y.id)?y:z[0]} onAction=${Q} />
                </div>
            `}
        </div>
    `}var Cl,Sl;var Zc=Y(()=>{m();bn();Cl=["all","active","paused","completed"];Sl={formatDateTime:Vn,formatDuration:qc,labelForSchedule:Ii,kindLabel:Yi,isProtectedTask:Ci}});function Ic(n){return String(n||"").toLowerCase().replace(/^[@/]+/,"").replace(/\s+/g," ").trim()}function En(n){return typeof n==="string"&&n.trim().length>0}function Oi(n,...r){let i=Ic(n);if(!i)return!0;let _=r.map((c)=>Ic(c)).filter(Boolean);for(let c of _)if(c.startsWith(i)||c.includes(i))return!0;return!1}function Yc(n){if(!Array.isArray(n))return null;let r=[],i=new Set;for(let _ of n){let c=String(_||"").trim();if(!c)continue;let u=c.toLowerCase();if(i.has(u))continue;i.add(u),r.push(c)}return r}function sr(n){let r=n&&typeof n==="object"?n:{};return{workspaceCommands:Yc(r.workspaceCommands),slashCommands:Yc(r.slashCommands)}}function Cc(n,r){if(!Array.isArray(n))return!0;return n.some((i)=>i.toLowerCase()===r.toLowerCase())}function el(n){let r=Array.isArray(n?.commands)?n.commands:[],i=sr(n?.settings),_=String(n?.query||"");return r.filter((c)=>Cc(i.workspaceCommands,c.id)).filter((c)=>Oi(_,c.label,c.description,...c.keywords||[])).map((c)=>({key:`workspace:${c.id}`,kind:"workspace",title:c.label,subtitle:c.description,searchText:`${c.label} ${c.description} ${(c.keywords||[]).join(" ")}`.trim(),visualHint:c.label.slice(0,1).toUpperCase()||"W",categoryLabel:"Workspace",actionHint:"Run",commandId:c.id}))}function ml(n){let r=Array.isArray(n?.agents)?n.agents:[],i=String(n?.query||""),_=new Set;return r.filter((c)=>{let u=En(c?.chat_jid)?c.chat_jid.trim():"";if(!u||_.has(u))return!1;if(c?.archived_at)return!1;return _.add(u),!0}).filter((c)=>Oi(i,`@${String(c?.agent_name||"").trim()}`,c?.session_name,c?.chat_jid)).map((c)=>{let u=En(c?.agent_name)?c.agent_name.trim():String(c?.chat_jid||"").replace(/^[^:]+:/,""),f=En(c?.session_name)?c.session_name.trim():"",o=String(c?.chat_jid||"").trim();return{key:`agent:${o}`,kind:"agent",title:`@${u}`,subtitle:f||o,searchText:`@${u} ${f} ${o}`.trim(),visualHint:u.slice(0,1).toUpperCase()||"@",categoryLabel:"Agent",actionHint:"Open",chatJid:o}})}function al(n){let r=Array.isArray(n?.slashCommands)?n.slashCommands:[],i=sr(n?.settings),_=String(n?.query||""),c=new Set;return r.filter((u)=>{let f=En(u?.name)?u.name.trim():"";if(!f||c.has(f.toLowerCase()))return!1;return c.add(f.toLowerCase()),Cc(i.slashCommands,f)}).filter((u)=>Oi(_,u?.name,u?.description,u?.source)).map((u)=>{let f=String(u?.name||"").trim(),o=En(u?.description)?u.description.trim():"slash command",s=En(u?.source)?u.source.trim():"";return{key:`slash:${f}`,kind:"slash",title:f,subtitle:o,searchText:`${f} ${o} ${String(u?.source||"")}`.trim(),visualHint:"/",categoryLabel:s||"Slash",actionHint:"Insert",commandName:f}})}function _s(n){return[...ml({agents:n?.agents,query:n?.query}),...el({commands:n?.workspaceCommands,settings:n?.settings,query:n?.query}),...al({slashCommands:n?.slashCommands,settings:n?.settings,query:n?.query})]}var dn;var Oc=Y(()=>{dn=[{id:"toggle-workspace",label:"Toggle workspace",description:"Show or hide the workspace sidebar.",keywords:["workspace","sidebar","explorer"]},{id:"open-explorer",label:"Open explorer",description:"Open the workspace explorer sidebar.",keywords:["workspace","explorer","sidebar"]},{id:"toggle-chat-only",label:"Chat-only mode",description:"Toggle chat-only mode.",keywords:["chat","mode","layout"]},{id:"open-terminal-tab",label:"Open terminal in tab",description:"Open the terminal pane in a workspace tab.",keywords:["terminal","shell","tab"]},{id:"open-vnc-tab",label:"Open VNC in tab",description:"Open the VNC viewer in a workspace tab.",keywords:["vnc","remote","desktop","tab"]},{id:"toggle-terminal-dock",label:"Toggle terminal dock",description:"Show or hide the terminal dock.",keywords:["terminal","dock","shell"]},{id:"open-settings",label:"Settings",description:"Open the settings dialog.",keywords:["settings","preferences","config"]}]});var dc={};_n(dc,{QuickActionsSection:()=>n0});function Jc(n,...r){let i=String(n||"").trim().toLowerCase();if(!i)return!0;return r.some((_)=>String(_||"").toLowerCase().includes(i))}function Ec(n){if(!Array.isArray(n))return null;return new Set(n.map((r)=>String(r||"").trim().toLowerCase()).filter(Boolean))}function n0({filter:n="",setStatus:r,mergeSettingsData:i}){let[_,c]=w(()=>dn.map((z)=>z.id)),[u,f]=w([]),[o,s]=w([]),[$,p]=w(!0),[g,b]=w(!1),x=T(async()=>{p(!0);try{let[z,j]=await Promise.all([pi(),vi("web:default").catch(()=>({commands:[]}))]),Q=sr(z?.settings),t=Array.isArray(j?.commands)?j.commands:[];s(t),c(Array.isArray(Q.workspaceCommands)?Q.workspaceCommands:dn.map((G)=>G.id)),f(Array.isArray(Q.slashCommands)?Q.slashCommands:t.map((G)=>String(G?.name||"").trim()).filter(Boolean))}catch(z){r?.(String(z?.message||z),"error")}finally{p(!1)}},[r]);X(()=>{x()},[x]);let v=D(()=>Ec(_),[_]),F=D(()=>Ec(u),[u]),y=D(()=>dn.filter((z)=>Jc(n,z.label,z.description,...z.keywords||[])),[n]),K=D(()=>o.filter((z)=>Jc(n,z?.name,z?.description,z?.source)),[o,n]),W=T((z)=>{c((j)=>{let Q=new Set((Array.isArray(j)?j:[]).map((t)=>String(t||"").trim()).filter(Boolean));if(Q.has(z))Q.delete(z);else Q.add(z);return dn.map((t)=>t.id).filter((t)=>Q.has(t))})},[]),L=T((z)=>{f((j)=>{let Q=new Set((Array.isArray(j)?j:[]).map((t)=>String(t||"").trim()).filter(Boolean));if(Q.has(z))Q.delete(z);else Q.add(z);return o.map((t)=>String(t?.name||"").trim()).filter((t)=>t&&Q.has(t))})},[o]),B=T(()=>{c(dn.map((z)=>z.id)),f(o.map((z)=>String(z?.name||"").trim()).filter(Boolean))},[o]),U=T(async()=>{if(g)return;b(!0),r?.("Saving quick actions…","info");try{let z=await bi({workspaceCommands:_,slashCommands:u}),j=sr(z?.settings);i?.({quickActions:j}),window.dispatchEvent(new CustomEvent("piclaw:quick-actions-settings-updated",{detail:{settings:j}})),r?.("Quick Actions saved.","success")}catch(z){r?.(String(z?.message||z),"error")}finally{b(!1)}},[i,g,r,u,_]);if($)return l`<div class="settings-loading">Loading…</div>`;return l`
        <div class="settings-section">
            <h3>Timeline Quick Actions</h3>
            <p class="settings-hint">
                Choose which actions appear in the timeline typeahead. Agents are always pinned first, then workspace commands, then slash commands.
            </p>

            <div class="settings-row" style="align-items:center; gap:10px; margin-bottom:12px;">
                <button class="settings-addon-btn" onClick=${B} disabled=${g}>Enable all</button>
                <button class="settings-addon-btn settings-addon-btn-install" onClick=${U} disabled=${g}>
                    ${g?"Saving…":"Save & apply"}
                </button>
            </div>

            <h3 style="margin-top:8px;">Workspace commands</h3>
            <div class="settings-subsection-list">
                ${y.map((z)=>{let j=v?v.has(z.id.toLowerCase()):!0;return l`
                        <label class="settings-checkbox-row" key=${z.id}>
                            <input type="checkbox" checked=${j} onChange=${()=>W(z.id)} />
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
                ${K.map((z)=>{let j=String(z?.name||"").trim(),Q=F?F.has(j.toLowerCase()):!0;return l`
                        <label class="settings-checkbox-row" key=${j}>
                            <input type="checkbox" checked=${Q} onChange=${()=>L(j)} />
                            <div>
                                <div><code>${j}</code></div>
                                <div class="settings-hint" style="margin:2px 0 0 0;">${z?.description||"slash command"}</div>
                            </div>
                        </label>
                    `})}
                ${K.length===0&&l`<div class="settings-hint">No slash commands match this filter.</div>`}
            </div>
        </div>
    `}var Sc=Y(()=>{m();bn();Oc()});var ec={};_n(ec,{KeychainSection:()=>_0});function r0(n){if(!n)return"—";try{return new Date(n).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"})}catch{return n}}function _0({filter:n=""}){let[r,i]=w([]),[_,c]=w(!0),[u,f]=w(null),[o,s]=w(!1),[$,p]=w(""),[g,b]=w(""),[x,v]=w(""),[F,y]=w(""),[K,W]=w(""),[L,B]=w("secret"),[U,z]=w(!1),[j,Q]=w({}),[t,G]=w(null),[k,h]=w(null),[H,A]=w(null),C=Z(null),O=Z(null),gn=Z(null),a=T(async()=>{c(!0),f(null);try{let M=await(await fetch("/agent/keychain")).json();if(M?.ok)i(M.entries||[]);else f(M?.error||"Failed to load keychain.")}catch(R){f("Failed to load keychain.")}finally{c(!1)}},[]);X(()=>{a()},[a]);let un=T(async()=>{let R=$.trim(),M=g;if(!R||!M)return;z(!0);try{let on=await(await fetch("/agent/keychain",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:R,secret:M,type:L,username:x.trim()||void 0,userNote:F,agentNote:K})})).json();if(on?.ok)p(""),b(""),v(""),y(""),W(""),B("secret"),s(!1),await a();else f(on?.error||"Failed to add entry.")}catch{f("Failed to add entry.")}finally{z(!1)}},[$,g,x,F,K,L,a]),ln=T(async(R)=>{try{let rn=await(await fetch("/agent/keychain",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:R})})).json();if(rn?.ok)h(null),A((on)=>on?.name===R?null:on),await a();else f(rn?.error||"Failed to delete entry.")}catch{f("Failed to delete entry.")}},[a]),wn=T(async(R)=>{let M=R?.name;if(!M)return;let rn=j[M]||{},on=Object.prototype.hasOwnProperty.call(rn,"userNote")?rn.userNote:R.userNote||"",$n=Object.prototype.hasOwnProperty.call(rn,"agentNote")?rn.agentNote:R.agentNote||"";G(M);try{let jn=await(await fetch("/agent/keychain/notes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:M,userNote:on,agentNote:$n})})).json();if(jn?.ok)Q((wr)=>{let en={...wr||{}};return delete en[M],en}),await a();else f(jn?.error||"Failed to save notes.")}catch{f("Failed to save notes.")}finally{G(null)}},[j,a]),I=T((R,M,rn)=>{Q((on)=>({...on||{},[R]:{...(on||{})[R]||{},[M]:rn}}))},[]),V=T(async(R,M,rn)=>{try{let $n=await(await fetch("/agent/keychain/reveal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:R,master_password:M||void 0,totp_code:rn||void 0})})).json();if($n?.ok)A({name:R,phase:"revealed",secret:$n.secret,username:$n.username,masterPassword:M});else if($n?.needs_master_password)A((xn)=>({name:R,phase:"password",masterPassword:"",error:xn?.name===R&&xn?.masterPassword?$n.error:null})),requestAnimationFrame(()=>O.current?.focus());else if($n?.needs_totp)A((xn)=>({name:R,phase:"totp",masterPassword:M,totpCode:"",error:xn?.name===R&&xn?.phase==="totp"&&xn?.totpCode?$n.error:null})),requestAnimationFrame(()=>gn.current?.focus());else A({name:R,phase:"error",error:$n?.error||"Failed to reveal."})}catch{A({name:R,phase:"error",error:"Failed to reveal."})}},[]),q=T((R)=>{if(H?.name===R&&H?.phase==="revealed"){A(null);return}V(R,null,null)},[H,V]),yn=T((R)=>{let M=H?.masterPassword||"";if(!M)return;V(R,M,null)},[H,V]),N=T((R)=>{let M=H?.totpCode||"";if(M.length<6)return;V(R,H?.masterPassword,M)},[H,V]),d=T(async(R)=>{try{await navigator.clipboard.writeText(R)}catch{let M=document.createElement("textarea");M.value=R,M.style.position="fixed",M.style.opacity="0",document.body.appendChild(M),M.select(),document.execCommand("copy"),document.body.removeChild(M)}},[]);X(()=>{if(o)requestAnimationFrame(()=>C.current?.focus())},[o]);let cn=n.toLowerCase(),Fn=D(()=>{if(!cn)return r;return r.filter((R)=>R.name.toLowerCase().includes(cn)||(R.type||"").toLowerCase().includes(cn)||(R.envVar||"").toLowerCase().includes(cn)||(R.userNote||"").toLowerCase().includes(cn)||(R.agentNote||"").toLowerCase().includes(cn))},[r,cn]);if(_)return l`<div class="settings-section"><div class="settings-loading">Loading keychain…</div></div>`;return l`
        <div class="settings-section">
            ${u&&l`
                <div class="settings-keychain-error" role="alert">
                    ${u}
                    <button class="settings-keychain-dismiss" onClick=${()=>f(null)}>✕</button>
                </div>
            `}
            <div class="settings-keychain-toolbar" style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <span class="settings-hint" style="margin:0; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span>${Fn.length} entr${Fn.length===1?"y":"ies"}${cn?` matching "${n}"`:""}, encrypted at rest.</span>
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
                            value=${$} onInput=${(R)=>p(R.target.value)}
                            class="settings-keychain-input" />
                        <select value=${L} onChange=${(R)=>B(R.target.value)}
                            class="settings-keychain-select">
                            ${i0.map((R)=>l`<option value=${R}>${R}</option>`)}
                        </select>
                    </div>
                    <div class="settings-keychain-add-row">
                        <input type="password" placeholder="Secret value"
                            value=${g} onInput=${(R)=>b(R.target.value)}
                            class="settings-keychain-input settings-keychain-secret" />
                        <input type="text" placeholder="Username (optional)"
                            value=${x} onInput=${(R)=>v(R.target.value)}
                            class="settings-keychain-input" style="max-width:200px" />
                        <button class="settings-keychain-save-btn" onClick=${un}
                            disabled=${U||!$.trim()||!g}>
                            ${U?"Saving…":"Save"}
                        </button>
                    </div>
                    <div class="settings-keychain-add-row" style="align-items:stretch">
                        <textarea placeholder="User note (visible in this UI only)"
                            value=${F} onInput=${(R)=>y(R.target.value)}
                            class="settings-keychain-input" rows="2" style="resize:vertical; min-height:56px"></textarea>
                        <textarea placeholder="Agent note (safe to expose to agents)"
                            value=${K} onInput=${(R)=>W(R.target.value)}
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
                        ${Fn.length===0&&l`
                            <tr><td colspan="5" class="settings-keychain-empty">
                                ${cn?"No entries match the filter.":"No keychain entries."}
                            </td></tr>
                        `}
                        ${Fn.map((R)=>{let M=H?.name===R.name?H:null,rn=M?.phase==="revealed",on=M?.phase==="password",$n=M?.phase==="totp",xn=M?.phase==="error",jn=j[R.name]||{},wr=Object.prototype.hasOwnProperty.call(jn,"userNote")?jn.userNote:R.userNote||"",en=Object.prototype.hasOwnProperty.call(jn,"agentNote")?jn.agentNote:R.agentNote||"",tu=wr!==(R.userNote||"")||en!==(R.agentNote||""),mi=t===R.name;return l`
                            <tr class="settings-keychain-row" key=${R.name}>
                                <td class="settings-keychain-name">${R.name}</td>
                                <td><span class="settings-keychain-type-badge">${R.type}</span></td>
                                <td class="settings-keychain-env">${R.envVar?l`<code>$${R.envVar}</code>`:"—"}</td>
                                <td class="settings-keychain-date">${r0(R.updatedAt)}</td>
                                <td class="settings-keychain-actions">
                                    <button class=${`settings-keychain-reveal-btn${rn?" active":""}`}
                                        onClick=${()=>q(R.name)}
                                        title=${rn?"Hide secret":"Reveal secret"}>
                                        ${rn?l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`:l`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}
                                    </button>
                                    ${k===R.name?l`
                                            <span class="settings-keychain-confirm">Delete?
                                                <button class="settings-keychain-confirm-yes" onClick=${()=>ln(R.name)}>Yes</button>
                                                <button class="settings-keychain-confirm-no" onClick=${()=>h(null)}>No</button>
                                            </span>
                                        `:l`<button class="settings-keychain-delete-btn" onClick=${()=>h(R.name)} title="Delete">🗑</button>`}
                                </td>
                            </tr>
                            <tr class="settings-keychain-notes-row" key=${R.name+"-notes"}>
                                <td colspan="5">
                                    <div style="display:grid; grid-template-columns:1fr 1fr auto; gap:8px; align-items:start; padding:8px 0 10px 0;">
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">User note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Human/UI note only"
                                                value=${wr}
                                                onInput=${(sn)=>I(R.name,"userNote",sn.target.value)}></textarea>
                                        </label>
                                        <label style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                                            <span class="settings-hint" style="margin:0">Agent-readable note</span>
                                            <textarea class="settings-keychain-input" rows="2" style="resize:vertical; min-height:52px; width:100%;" placeholder="Safe guidance for agents"
                                                value=${en}
                                                onInput=${(sn)=>I(R.name,"agentNote",sn.target.value)}></textarea>
                                        </label>
                                        <button class="settings-keychain-save-btn" style="margin-top:20px" disabled=${!tu||mi} onClick=${()=>wn(R)}>
                                            ${mi?"Saving…":"Save notes"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ${on&&l`
                                <tr class="settings-keychain-prompt-row" key=${R.name+"-pw"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">Master password:</span>
                                            <input ref=${O} type="password" autocomplete="off"
                                                placeholder="Enter keychain master password"
                                                class="settings-keychain-prompt-input"
                                                value=${M?.masterPassword||""}
                                                onInput=${(sn)=>A((Ir)=>({...Ir,masterPassword:sn.target.value}))}
                                                onKeyDown=${(sn)=>{if(sn.key==="Enter")yn(R.name);if(sn.key==="Escape")A(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>yn(R.name)}
                                                disabled=${!M?.masterPassword}>Unlock</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>A(null)}>Cancel</button>
                                            ${M?.error&&l`<span class="settings-keychain-prompt-error">${M.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${$n&&l`
                                <tr class="settings-keychain-prompt-row" key=${R.name+"-totp"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-prompt">
                                            <span class="settings-keychain-prompt-label">TOTP code:</span>
                                            <input ref=${gn} type="text" inputmode="numeric" autocomplete="one-time-code"
                                                maxlength="6" placeholder="000000"
                                                class="settings-keychain-prompt-input" style="width:90px;text-align:center;letter-spacing:0.15em"
                                                value=${M?.totpCode||""}
                                                onInput=${(sn)=>A((Ir)=>({...Ir,totpCode:sn.target.value.replace(/\\D/g,"").slice(0,6)}))}
                                                onKeyDown=${(sn)=>{if(sn.key==="Enter")N(R.name);if(sn.key==="Escape")A(null)}}
                                            />
                                            <button class="settings-keychain-prompt-submit" onClick=${()=>N(R.name)}
                                                disabled=${(M?.totpCode||"").length<6}>Verify</button>
                                            <button class="settings-keychain-prompt-cancel" onClick=${()=>A(null)}>Cancel</button>
                                            ${M?.error&&l`<span class="settings-keychain-prompt-error">${M.error}</span>`}
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${rn&&l`
                                <tr class="settings-keychain-reveal-row" key=${R.name+"-reveal"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel">
                                            ${M.username&&l`
                                                <div class="settings-keychain-reveal-field">
                                                    <span class="settings-keychain-reveal-label">Username</span>
                                                    <code class="settings-keychain-reveal-value">${M.username}</code>
                                                    <button class="settings-keychain-copy-btn" onClick=${()=>d(M.username)} title="Copy username">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                    </button>
                                                </div>
                                            `}
                                            <div class="settings-keychain-reveal-field">
                                                <span class="settings-keychain-reveal-label">Secret</span>
                                                <code class="settings-keychain-reveal-value">${M.secret}</code>
                                                <button class="settings-keychain-copy-btn" onClick=${()=>d(M.secret)} title="Copy secret">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `}
                            ${xn&&l`
                                <tr class="settings-keychain-reveal-row" key=${R.name+"-error"}>
                                    <td colspan="5">
                                        <div class="settings-keychain-reveal-panel" style="color: var(--error-color, #e55)">${M.error}</div>
                                    </td>
                                </tr>
                            `}
                        `})}
                    </tbody>
                </table>
            </div>
        </div>
    `}var i0;var mc=Y(()=>{m();i0=["secret","token","password","basic"]});var ac={};_n(ac,{ToolsSection:()=>o0});function o0({toolsets:n,filter:r="",settingsData:i,mergeSettingsData:_}){let c=n||[],[u,f]=w(()=>{let v={};for(let F of c)v[F.name]=!0;return v}),o=T((v)=>{f((F)=>({...F,[v]:!F[v]}))},[]),s=i?.searchMatchMode||"or",$=D(()=>{let v=Array.isArray(i?.toolResultCompactionTools)?i.toolResultCompactionTools:[];return new Set(v.filter((F)=>typeof F==="string").map((F)=>F.trim().toLowerCase()).filter(Boolean))},[i?.toolResultCompactionTools]),p=T(async()=>{let v=s==="or"?"and":"or";try{let y=await(await fetch("/agent/settings/general",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({searchMatchMode:v})})).json().catch(()=>({}));if(y?.ok&&y?.settings)_?.(y.settings)}catch(F){console.warn("[settings/tools] Failed to save search match mode.",F)}},[s,_]),g=T(async(v)=>{let F=String(v||"").trim().toLowerCase();if(!F)return;let y=new Set($);if(y.has(F))y.delete(F);else y.add(F);try{let W=await(await fetch("/agent/settings/compaction",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({toolResultCompactionTools:Array.from(y).sort()})})).json().catch(()=>({}));if(W?.ok&&W?.settings)_?.(W.settings)}catch(K){console.warn("[settings/tools] Failed to save tool compaction settings.",K)}},[$,_]),b=r.toLowerCase(),x=D(()=>{if(!b)return c;return c.map((v)=>{let F=v.tools.filter((y)=>y.name.toLowerCase().includes(b)||v.name.toLowerCase().includes(b)||(y.summary||"").toLowerCase().includes(b));return F.length>0?{...v,tools:F}:null}).filter(Boolean)},[c,b]);if(c.length===0)return l`<div class="settings-section"><p class="settings-hint">Tool data not available.</p></div>`;return l`
        <div class="settings-section">
            <div class="settings-search-options">
                <h4 style="margin:0 0 8px 0">Search</h4>
                <div class="settings-row">
                    <label>Match mode</label>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" checked=${s==="and"} onChange=${p} />
                        <span class="settings-hint" style="margin:0">
                            ${s==="or"?"Any keyword (OR) — results match at least one search term":"All keywords (AND) — results must match every search term"}
                        </span>
                    </div>
                </div>
            </div>
            ${x.map((v)=>{let F=u[v.name]!==!1;return l`
                <div class="settings-toolset">
                    <div class="settings-toolset-header">
                        <label class="settings-toolset-toggle">
                            <input type="checkbox" checked=${F} onChange=${()=>o(v.name)} />
                            <span class="settings-toolset-icon">${c0[v.name]||l0}</span>
                            <strong>${v.name}</strong>
                        </label>
                        <span class="settings-hint" style="margin:0">${v.description}</span>
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
                        ${v.tools.map((y)=>{let K=String(y.name||"").trim().toLowerCase(),W=$.has(K);return l`
                                <div class="settings-tool-row">
                                    <input type="checkbox" checked disabled />
                                    <span class="settings-tool-name">${y.name}</span>
                                    <span class="settings-tool-compact">
                                        <input
                                            type="checkbox"
                                            checked=${W}
                                            onChange=${()=>g(y.name)}
                                            title=${W?"Disable tool-result compaction for this tool":"Enable tool-result compaction for this tool"}
                                        />
                                    </span>
                                    <span class="settings-tool-kind" title=${y.kind}>${f0[y.kind]||"?"}</span>
                                    ${y.summary&&l`<span class="settings-tool-summary">${y.summary}</span>`}
                                    ${!y.summary&&l`<span class="settings-tool-summary"></span>`}
                                    <span class="settings-tool-source">${u0[y.name]||v.name}</span>
                                </div>
                            `})}
                    </div>`}
                </div>
            `})}
            ${x.length===0&&l`<p class="settings-hint">No tools match "${r}"</p>`}
            <p class="settings-hint">Tool activation is managed by the agent runtime. Group checkboxes collapse/expand; the “Compact” column controls tool-result compaction eligibility.</p>
        </div>
    `}var c0,u0,f0,l0;var nu=Y(()=>{m();c0={core:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M7.5 10l2.5 2-2.5 2"/><path d="M12.5 15H16"/></svg>`,discovery:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,attachments:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,"model-control":l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><path d="M9 15c.83.67 2 1 3 1s2.17-.33 3-1"/></svg>`,data:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,workspace:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,automation:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,remote:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,browser:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,ui:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,experiments:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v7l4.6 7.7A1 1 0 0 1 18.7 19H5.3a1 1 0 0 1-.9-1.3L9 10z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>`,lifecycle:l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`},u0={read:"pi-core",write:"pi-core",edit:"pi-core",bash:"pi-core",powershell:"pi-core",find:"pi-core",grep:"pi-core",ls:"pi-core",list_tools:"internal-tools",activate_tools:"tool-activation",reset_active_tools:"tool-activation",list_scripts:"runtime-scripts",attach_file:"file-attachments",read_attachment:"file-attachments",export_attachment:"file-attachments",get_model_state:"model-control",list_models:"model-control",switch_model:"model-control",switch_thinking:"model-control",messages:"messages-crud",introspect_sql:"sql-introspect",keychain:"keychain-tools",search_workspace:"workspace-search",refresh_workspace_index:"workspace-search",open_office_viewer:"office-viewer",office_read:"office-viewer",office_write:"office-viewer",open_workspace_file:"open-workspace-file",image_process:"image-processing",schedule_task:"scheduled-tasks",scheduled_tasks:"scheduled-tasks",bun_run:"bun-runner",exec_batch:"exec-batch",search_tool_output:"search-tool-output",ssh:"ssh",proxmox:"proxmox",portainer:"portainer",mcp:"mcp",cdp_browser:"cdp-browser",send_adaptive_card:"send-adaptive-card",send_dashboard_widget:"send-dashboard-widget",start_autoresearch:"autoresearch",stop_autoresearch:"autoresearch",autoresearch_status:"autoresearch",exit_process:"exit-process",env:"env-tools"},f0={"read-only":"\uD83D\uDD0D",mutating:"✏️",mixed:"\uD83D\uDD04"},l0=l`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`});var ru={};_n(ru,{AddonsSection:()=>s0});function s0({setStatus:n,filter:r=""}){let[i,_]=w(null),[c,u]=w(!0),[f,o]=w(null),[s,$]=w(!1),[p,g]=w({runtime:"",windowsNative:!1}),[b,x]=w([]),[v,F]=w([]);function y(){let t=new URLSearchParams;try{let k=(localStorage.getItem("piclaw_addons_catalog_url")||"").trim(),h=(localStorage.getItem("piclaw_addons_catalog_urls")||"").split(/\r?\n/).map((A)=>A.trim()).filter(Boolean),H=localStorage.getItem("piclaw_addons_repo_url");if(k)t.append("catalog_url",k);for(let A of h)t.append("catalog_url",A);if(H)t.set("repo_url",H)}catch(k){}let G=t.toString();return G?`?${G}`:""}let K=T(async()=>{try{let[t,G]=await Promise.all([fetch(`/agent/addons${y()}`),fetch("/agent/settings-data")]),k=await t.json();if(k.error)throw Error(k.error);_(k.addons||[]),x(k.sources||[]),F(k.failed_sources||[]);let h=await G.json().catch(()=>({})),H=typeof h?.runtimePlatform==="string"?h.runtimePlatform:"";g({runtime:H,windowsNative:H==="win32"})}catch(t){_(null),n?.(String(t.message||t),"error")}finally{u(!1)}},[n]);X(()=>{K()},[]);let W=T(async(t)=>{if(f)return;o({slug:t,action:"install"}),n?.(`Installing ${t}…`,"info");try{let k=await(await fetch(`/agent/addons/install${y()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:t})})).json();if(k.error){n?.(k.error,"error");return}$(!0);let h=[k.message,k.warning].filter(Boolean).join(" ");n?.(h||"Add-on installed.","success"),await K()}catch(G){n?.(String(G.message||G),"error")}finally{o(null)}},[f,K,n]),L=T(async(t)=>{if(f)return;o({slug:t,action:"remove"}),n?.(`Removing ${t}…`,"info");try{let k=await(await fetch(`/agent/addons/uninstall${y()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:t})})).json();if(k.error){n?.(k.error,"error");return}$(!0);let h=[k.message,k.warning].filter(Boolean).join(" ");n?.(h||"Add-on removed.","success"),await K()}catch(G){n?.(String(G.message||G),"error")}finally{o(null)}},[f,K,n]),B=T(async()=>{if(f)return;o({slug:null,action:"restart"}),n?.("Restarting piclaw…","info");try{let G=await(await fetch("/agent/addons/restart",{method:"POST"})).json();if(G.error){n?.(G.error,"error"),o(null);return}n?.(G.message||"Restarting piclaw…","success"),$(!1),(async(h=30,H=2000)=>{for(let A=0;A<h;A++){await new Promise((C)=>setTimeout(C,H));try{if((await fetch("/agent/addons",{signal:AbortSignal.timeout(3000)})).ok){await K(),o(null),n?.("Restart complete — add-ons refreshed.","success");return}}catch(C){}}o(null),n?.("Backend did not return in time. Reload the page manually.","warning")})()}catch(t){n?.(String(t.message||t),"error"),o(null)}},[f,n,K]);if(c)return l`<div class="settings-loading">Fetching add-ons\u2026</div>`;if(!i)return l`<div class="settings-section"><p class="settings-hint">Could not load add-ons.</p></div>`;let U=r.toLowerCase(),z=U?i.filter((t)=>t.slug.toLowerCase().includes(U)||(t.description||"").toLowerCase().includes(U)||(t.tags||[]).some((G)=>G.toLowerCase().includes(U))):i,j=f?.slug||null,Q=f?f.action==="remove"?`Removing ${f.slug}…`:f.action==="restart"?"Restarting piclaw…":`Installing ${f.slug}…`:"";return l`
        <div class=${`settings-section settings-addon-panel${f?" busy":""}`} aria-busy=${f?"true":"false"}>
            <div class="settings-addon-toolbar">
                <div>
                    <p class="settings-hint">
                        ${b.length<=1?l`Catalog from <a href="https://github.com/rcarmo/piclaw-addons" target="_blank">rcarmo/piclaw-addons</a>.`:l`${b.length} catalog sources merged.`}
                        ${" "}Package-first install via Bun; restart required after install/uninstall.
                    </p>
                    ${v.length>0&&l`
                        <div class="settings-addon-error" role="alert">
                            Failed to fetch ${v.length} catalog source${v.length>1?"s":""}:
                            ${v.map((t)=>l` <code style="font-size:0.82em;word-break:break-all">${t}</code>`)}
                        </div>
                    `}
                    ${b.length>1&&l`
                        <details class="settings-hint" style="margin-top:4px">
                            <summary style="cursor:pointer">Active catalog sources (${b.length})</summary>
                            <ul style="margin:4px 0 0 16px;font-size:0.82em">
                                ${b.map((t)=>l`<li style="word-break:break-all"><code>${t}</code></li>`)}
                            </ul>
                        </details>
                    `}
                    ${p.windowsNative&&l`
                        <div class="settings-addon-error" role="alert">
                            Native Windows add-on installs are higher risk: Bun package installs, symlink cleanup, locked files, and restart timing can all be less predictable than in Linux/WSL. Prefer WSL or a container when possible.
                        </div>
                    `}
                </div>
            </div>
            <div class="settings-addon-list">
                ${f&&l`
                    <div class="settings-addon-panel-overlay" role="status" aria-live="polite" aria-label=${Q}>
                        <div class="settings-addon-panel-overlay-card">
                            <div class="settings-spinner"></div>
                            <span>${Q}</span>
                        </div>
                    </div>
                `}
                ${z.map((t)=>{let G=(t.skills||[]).length>0,k=t.type==="extension",h=G&&k?"extension + skill":G?"skill":"extension",H=G&&!k?"settings-tag-skill":"",A=typeof t.homepage==="string"&&t.homepage.trim()?t.homepage.trim():"";return l`
                    <div class=${`settings-addon-card${t.installed?" installed":""}`}>
                        <div class="settings-addon-card-header">
                            ${A?l`<a class="settings-addon-name-link" href=${A} target="_blank" rel="noopener noreferrer">${t.slug}</a>`:l`<strong>${t.slug}</strong>`}
                            <span class=${`settings-tag settings-tag-type ${H}`}>${h}</span>
                            <span class="settings-addon-version">${t.installed?t.installedVersion||"?":t.version||""}</span>
                            ${t.installKind&&l`<span class="settings-tag">${t.installKind}</span>`}
                            ${t.hasUpdate&&l`<span class="settings-tag settings-tag-skill">\u2191 ${t.version}</span>`}
                            <div class="settings-addon-actions">
                                ${t.installed?l`
                                    ${t.hasUpdate&&l`<button class="settings-addon-btn settings-addon-btn-upgrade" disabled=${Boolean(f)} onClick=${()=>W(t.slug)}>${j===t.slug?"…":"Update"}</button>`}
                                    <button class="settings-addon-btn settings-addon-btn-remove" disabled=${Boolean(f)} onClick=${()=>L(t.slug)}>${j===t.slug?"…":"Remove"}</button>
                                `:l`
                                    <button class="settings-addon-btn settings-addon-btn-install" disabled=${Boolean(f)} onClick=${()=>W(t.slug)}>${j===t.slug?"…":"Install"}</button>
                                `}
                            </div>
                        </div>
                        <div class="settings-addon-card-body">${t.description}</div>
                        <div class="settings-addon-card-footer">
                            <div class="settings-addon-tags">${(t.tags||[]).map((C)=>l`<span class="settings-tag">${C}</span>`)}${(t.skills||[]).map((C)=>l`<span class="settings-tag settings-tag-skill">\ud83d\udcdd ${C}</span>`)}</div>
                        </div>
                    </div>
                `})}
                ${z.length===0&&l`<p class="settings-hint">No add-ons match "${r}"</p>`}
            </div>
            ${s&&l`
                <div class="settings-addon-restart-notice" role="status" aria-live="polite">
                    <span>Extension changes are installed but inactive until piclaw restarts.</span>
                    <button class="settings-addon-btn settings-addon-btn-restart-now" type="button" disabled=${Boolean(f)} onClick=${B}>Restart Now</button>
                </div>
            `}
        </div>
    `}var iu=Y(()=>{m()});var x0={};function Ji(n,r){try{let i=localStorage.getItem(n);return i===null?r:i==="true"}catch{return r}}function Ar(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function g0(n,r){try{return localStorage.getItem(n)||r}catch{return r}}function $0(n,r){try{localStorage.setItem(n,r)}catch(i){}}function w0(n,r,i,_){try{return In(localStorage.getItem(n),{fallback:r,min:i,max:_})}catch{return In(r,{fallback:r,min:i,max:_})}}function t0(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function y0(){let[n,r]=w(()=>Ji("piclaw_vim_mode",!1)),[i,_]=w(()=>Ji("piclaw_show_whitespace",!0)),[c,u]=w(()=>Ji("piclaw_md_live_preview",!0)),[f,o]=w(()=>w0("piclaw_editor_font_size",13,10,24)),[s,$]=w(()=>g0("piclaw_editor_font_family","")),p=T((g,b,x)=>{let v=!b;x(v),Ar(g,v)},[]);return l`
        <div class="settings-section">
            <h3>Editor</h3>
            <div class="settings-row">
                <label>Vim mode</label>
                <input type="checkbox" checked=${n}
                    onChange=${()=>{let g=!n;r(g),Ar("piclaw_vim_mode",g)}} />
            </div>
            <div class="settings-row">
                <label>Show whitespace</label>
                <input type="checkbox" checked=${i}
                    onChange=${()=>{let g=!i;_(g),Ar("piclaw_show_whitespace",g)}} />
            </div>
            <div class="settings-row">
                <label>Markdown live preview</label>
                <input type="checkbox" checked=${c}
                    onChange=${()=>{let g=!c;u(g),Ar("piclaw_md_live_preview",g)}} />
            </div>
            <div class="settings-row">
                <label>Font size (px)</label>
                <${e}
                    label="editor font size"
                    value=${f}
                    min=${10}
                    max=${24}
                    fallback=${13}
                    width="70px"
                    onChange=${(g)=>{o(g),t0("piclaw_editor_font_size",g)}}
                />
            </div>
            <div class="settings-row">
                <label>Font family</label>
                <input type="text" value=${s}
                    onInput=${(g)=>{let b=g.target.value;$(b),$0("piclaw_editor_font_family",b)}}
                    placeholder="monospace (default)" />
            </div>
            <p class="settings-hint settings-local-only-hint">This browser only. Editor changes are stored in local browser storage and take effect when you next open or reload a file tab.</p>
        </div>
    `}var h0;var _u=Y(()=>{m();nr();Yn();h0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;Mn({id:"editor",label:"Editor",icon:h0,component:y0,order:150})});var b0={};function Ei(n,r){try{let i=localStorage.getItem(n);return i===null?r:i==="true"}catch{return r}}function di(n,r){try{localStorage.setItem(n,String(r))}catch(i){}}function Si(n,r){try{return localStorage.getItem(n)||r}catch{return r}}function ei(n,r){try{localStorage.setItem(n,r)}catch(i){}}function v0(){let[n,r]=w(()=>Ei("piclaw_dev_mode",!1)),[i,_]=w(()=>Si("piclaw_addons_catalog_url","")),[c,u]=w(()=>Si("piclaw_addons_catalog_urls","")),[f,o]=w(()=>Si("piclaw_addons_repo_url","")),[s,$]=w(()=>Ei("piclaw_debug_sse",!1)),[p,g]=w(()=>Ei("piclaw_debug_tool_calls",!1)),b=T(()=>{let x=!n;r(x),di("piclaw_dev_mode",x)},[n]);return l`
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
                        onInput=${(x)=>{let v=x.target.value;_(v),ei("piclaw_addons_catalog_url",v)}}
                        placeholder="https://raw.githubusercontent.com/.../catalog.json" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Primary add-on catalog URL. Leave empty to use the default (<code>rcarmo/piclaw-addons</code>).</p>
                <div class="settings-row" style="align-items:flex-start;">
                    <label>Additional catalog URLs</label>
                    <textarea
                        value=${c}
                        onInput=${(x)=>{let v=x.target.value;u(v),ei("piclaw_addons_catalog_urls",v)}}
                        placeholder="One URL per line\nhttps://example.com/catalog.json"
                        style="max-width:400px; min-height:86px; resize:vertical;"
                    ></textarea>
                </div>
                <p class="settings-hint" style="margin-top:0">Fetched in addition to the primary/default catalog. One URL per line.</p>
                <div class="settings-row">
                    <label>Repo URL</label>
                    <input type="text" value=${f}
                        onInput=${(x)=>{let v=x.target.value;o(v),ei("piclaw_addons_repo_url",v)}}
                        placeholder="https://github.com/.../piclaw-addons.git" style="max-width:400px" />
                </div>
                <p class="settings-hint" style="margin-top:0">Override the git repo used for <code>bun add</code> installs. Leave empty for default.</p>

                <h3 style="margin-top:16px">Debug</h3>
                <div class="settings-row">
                    <label>Log SSE events</label>
                    <input type="checkbox" checked=${s}
                        onChange=${()=>{let x=!s;$(x),di("piclaw_debug_sse",x)}} />
                </div>
                <div class="settings-row">
                    <label>Log tool calls</label>
                    <input type="checkbox" checked=${p}
                        onChange=${()=>{let x=!p;g(x),di("piclaw_debug_tool_calls",x)}} />
                </div>
                <p class="settings-hint">Debug flags take effect on next page reload.</p>
            `}
        </div>
    `}var p0;var cu=Y(()=>{m();nr();p0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;Mn({id:"developer",label:"Developer",icon:p0,component:v0,order:900})});var D0={};_n(D0,{openSettingsDialog:()=>q0,SettingsDialogContent:()=>Zr,SettingsDialog:()=>M0});function $r(n){gr.push({ts:performance.now(),label:n})}function K0(){if(!gr.length)return;let n=gr[0].ts,r=gr.map((i)=>`+${(i.ts-n).toFixed(1)}ms ${i.label}`);console.info(`[settings-dialog perf]
`+r.join(`
`));try{window.__piclawSettingsPerfLog=r}catch(i){}try{fetch("/agent/client-perf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({label:"settings-dialog",lines:r})}).catch((i)=>{})}catch(i){}gr.length=0}function B0(n){let r=Dr.get(n);if(r)return Promise.resolve(r);let i=Mr.get(n);if(i)return i;let _=z0[n]().then((c)=>{return Dr.set(n,c),Mr.delete(n),c}).catch((c)=>{throw Mr.delete(n),c});return Mr.set(n,_),_}function qr(n="Loading…"){return l`
        <div class="settings-loading settings-loading-pane" role="status" aria-live="polite">
            <span class="settings-spinner"></span>
            <span>${n}</span>
        </div>
    `}function Zr({onClose:n}){$r("SettingsDialogContent-render-start");let[r,i]=w(()=>ci()||"general"),[_,c]=w(uu),[u,f]=w(null),[o,s]=w(""),[,$]=w(0),[p,g]=w(()=>Object.fromEntries(Dr.entries())),[b,x]=w(null),[v,F]=w({compact:!1,narrow:!1}),y=Z(null),K=Z(null);X(()=>{$r("SettingsDialogContent-mounted"),K0()},[]),X(()=>{let h=(H)=>{if(H.key==="Escape")n()};return window.addEventListener("keydown",h),()=>window.removeEventListener("keydown",h)},[n]),X(()=>{let h=(H)=>{let A=typeof H?.detail?.section==="string"?H.detail.section.trim():"";if(A)i(A),s("")};return window.addEventListener("piclaw:open-settings",h),()=>window.removeEventListener("piclaw:open-settings",h)},[]),X(()=>{let h=()=>$((H)=>H+1);return window.addEventListener("piclaw:settings-panes-changed",h),()=>window.removeEventListener("piclaw:settings-panes-changed",h)},[]),X(()=>{fetch("/agent/settings-data").then((h)=>h.json()).then((h)=>{uu=h,c(h)}).catch(()=>c({}))},[]),X(()=>{let h=K.current;if(!h)return;let H=()=>{let A=h.clientWidth||0;F((C)=>{let O={compact:A>0&&A<=860,narrow:A>0&&A<=720};return C.compact===O.compact&&C.narrow===O.narrow?C:O})};if(H(),typeof ResizeObserver==="function"){let A=new ResizeObserver(()=>H());return A.observe(h),()=>A.disconnect()}return window.addEventListener("resize",H),()=>window.removeEventListener("resize",H)},[]);let W=[...lu].sort((h,H)=>(h.order??500)-(H.order??500)),B=T_().map((h)=>({id:h.id,label:h.label,icon:h.icon,searchable:h.searchable||!1,placeholder:h.searchPlaceholder,order:h.order??500,isExtension:!0,component:h.component})).sort(_i),U=[...W,...B],z=U.find((h)=>h.id===r)||lu.find((h)=>h.id===r);X(()=>{if(z?.searchable)requestAnimationFrame(()=>y.current?.focus())},[r]),X(()=>{if(z?.isExtension){x(null);return}let h=!1;if(p[r]){x(null);return}return x(r),B0(r).then((H)=>{if(h)return;g((A)=>A?.[r]?A:{...A||{},[r]:H})}).catch((H)=>{if(h)return;console.error(`[settings-dialog] Failed to lazy-load section "${r}".`,H)}).finally(()=>{if(!h)x((H)=>H===r?null:H)}),()=>{h=!0}},[r,z?.isExtension,p]);let j=T((h,H="info")=>{f(h?{text:h,type:H}:null)},[]),Q=T((h)=>{i(h),s("");let H=F0[h];if(H&&!fu.has(h))fu.add(h),H().then(()=>$((A)=>A+1)).catch((A)=>{})},[]),t=T((h)=>{c((H)=>({...H||{},...h||{}}))},[]),G=()=>{if(z?.isExtension){if(!z.component)return qr("Loading pane…");let H=z.component;return l`<${H} filter=${o} />`}let h=p[r];if(!h||b===r)return qr(`Loading ${z?.label||"settings"}…`);switch(r){case"general":return l`<${h} settingsData=${_} setStatus=${j} mergeSettingsData=${t} />`;case"sessions":return l`<${h} settingsData=${_} setStatus=${j} mergeSettingsData=${t} />`;case"recordings":return l`<${h} filter=${o} setStatus=${j} />`;case"compaction":return l`<${h} settingsData=${_} setStatus=${j} mergeSettingsData=${t} />`;case"keyboard":return l`<${h} filter=${o} setStatus=${j} />`;case"workspace":return l`<${h} settingsData=${_} setStatus=${j} mergeSettingsData=${t} />`;case"environment":return l`<${h} settingsData=${_} filter=${o} setStatus=${j} mergeSettingsData=${t} />`;case"providers":return l`<${h} providers=${_?.providers} setStatus=${j} />`;case"models":return l`<${h} filter=${o} />`;case"theme":return l`<${h} themes=${_?.themes} colorKeys=${_?.colorKeys} settingsData=${_} setStatus=${j} mergeSettingsData=${t} />`;case"scheduled-tasks":return l`<${h} filter=${o} setStatus=${j} />`;case"quick-actions":return l`<${h} filter=${o} setStatus=${j} mergeSettingsData=${t} />`;case"keychain":return l`<${h} filter=${o} />`;case"tools":return l`<${h} toolsets=${_?.toolsets} filter=${o} settingsData=${_} mergeSettingsData=${t} />`;case"addons":return l`<${h} setStatus=${j} filter=${o} />`;default:return qr("Loading settings…")}},k=!z;return $r("SettingsDialogContent-render-end"),l`
        <div class="settings-dialog-backdrop" onClick=${(h)=>{if(h.target===h.currentTarget)n()}}>
            <div ref=${K} data-testid="settings-dialog" class=${`settings-dialog${v.compact?" settings-dialog-compact":""}${v.narrow?" settings-dialog-narrow":""}`}>
                <div class="settings-dialog-header">
                    <span class="settings-dialog-title">Settings</span>
                    ${z?.searchable&&l`
                        <input ref=${y} type="text" class="settings-header-filter"
                            placeholder=${z.placeholder||"Filter…"}
                            value=${o} onInput=${(h)=>s(h.target.value)} />
                    `}
                    <button class="settings-dialog-close" onClick=${n} title="Close (Esc)">✕</button>
                </div>
                <div class="settings-dialog-body">
                    <nav class="settings-nav">
                        ${U.map((h,H)=>{let A=H>0&&!U[H-1].isExtension,C=h.isExtension&&A;return l`
                                ${C&&l`<div class="settings-nav-separator"></div>`}
                                <button class=${`settings-nav-item ${h.id===r?"active":""}`} onClick=${()=>Q(h.id)}>
                                    <span class="settings-nav-icon">${h.icon}</span>
                                    <span class="settings-nav-label">${h.label}</span>
                                </button>
                            `})}
                    </nav>
                    <main class="settings-content">
                        ${k?qr("Loading settings…"):G()}
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
    `}function M0(){let[n,r]=w(!1);if(X(()=>{let i=(c)=>{let u=kr(c?.detail?.section);if(u)try{window.__piclawSettingsRequestedSection=u}catch(f){}r(!0)};window.addEventListener("piclaw:open-settings",i);let _=G_();if(_.open){if(_.section)try{window.__piclawSettingsRequestedSection=_.section}catch(c){}r(!0)}return()=>window.removeEventListener("piclaw:open-settings",i)},[]),!n)return null;return l`<${j_} className="settings-portal"><${Zr} onClose=${()=>r(!1)} /><//>`}function q0(n={}){U_(n)}var gr,uu=null,Dr,Mr,z0,F0,fu,k0,W0,j0,R0,T0,U0,G0,H0,L0,N0,V0,P0,X0,Q0,A0,lu;var ou=Y(()=>{m();R_();nr();m_();gr=[];$r("module-eval-start");$r("imports-done");Dr=new Map,Mr=new Map;Dr.set("general",ji);z0={general:()=>Promise.resolve(ji),sessions:()=>Promise.resolve().then(() => (rc(),nc)).then((n)=>n.SessionsSection),recordings:()=>Promise.resolve().then(() => (_c(),ic)).then((n)=>n.RecordingsSection),compaction:()=>Promise.resolve().then(() => (uc(),cc)).then((n)=>n.CompactionSection),keyboard:()=>Promise.resolve().then(() => (tc(),wc)).then((n)=>n.KeyboardSection),workspace:()=>Promise.resolve().then(() => (Fc(),zc)).then((n)=>n.WorkspaceSection),environment:()=>Promise.resolve().then(() => (kc(),Bc)).then((n)=>n.EnvironmentSection),providers:()=>Promise.resolve().then(() => (jc(),Wc)).then((n)=>n.ProvidersSection),models:()=>Promise.resolve().then(() => (Tc(),Rc)).then((n)=>n.ModelsSection),theme:()=>Promise.resolve().then(() => (Mc(),Ac)).then((n)=>n.ThemeSection),"scheduled-tasks":()=>Promise.resolve().then(() => (Zc(),Dc)).then((n)=>n.ScheduledTasksSection),"quick-actions":()=>Promise.resolve().then(() => (Sc(),dc)).then((n)=>n.QuickActionsSection),keychain:()=>Promise.resolve().then(() => (mc(),ec)).then((n)=>n.KeychainSection),tools:()=>Promise.resolve().then(() => (nu(),ac)).then((n)=>n.ToolsSection),addons:()=>Promise.resolve().then(() => (iu(),ru)).then((n)=>n.AddonsSection)},F0={"editor-settings":()=>Promise.resolve().then(() => (_u(),x0)).then(()=>{}),developer:()=>Promise.resolve().then(() => (cu(),b0)).then(()=>{})},fu=new Set;k0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M8.5 5.9L9.6 2.3h4.8l1.1 3.6 3.7-.8 2.4 4.1-2.6 2.8 2.6 2.8-2.4 4.1-3.7-.8-1.1 3.6H9.6l-1.1-3.6-3.7.8-2.4-4.1L5 12 2.4 9.2l2.4-4.1z"/></svg>`,W0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,j0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2.2"/><path d="m13 10 4-2.5v9L13 14z"/></svg>`,R0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 10 9 10"/><path d="M12 7v5l3 3"/></svg>`,T0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,U0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/><path d="M8 7v10"/><path d="M16 7v10"/></svg>`,G0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01"/><path d="M10 9h.01"/><path d="M14 9h.01"/><path d="M18 9h.01"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M7 17h10"/></svg>`,H0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,L0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="14" height="10" rx="2"/><circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none"/><line x1="12" y1="9" x2="12" y2="5"/><circle cx="12" cy="4" r="1.5"/></svg>`,N0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.53-.21-1.01-.55-1.36-.34-.36-.55-.84-.55-1.37 0-1.1.9-2 2-2h2.36c3.08 0 5.64-2.56 5.64-5.64C22.9 5.85 18.05 2 12 2z"/><circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none"/></svg>`,V0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M7 3.5 4 6"/><path d="m17 3.5 3 2.5"/></svg>`,P0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,X0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,Q0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="14" r="3"/><path d="M11 14h9"/><path d="M16 14v-2"/><path d="M19 14v2"/></svg>`,A0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,lu=[{id:"general",label:"General",icon:k0,searchable:!1,order:10},{id:"sessions",label:"Sessions",icon:W0,searchable:!1,order:12},{id:"recordings",label:"Recordings",icon:j0,searchable:!0,placeholder:"Filter recordings…",order:12.5},{id:"compaction",label:"Compaction",icon:R0,searchable:!1,order:13},{id:"keyboard",label:"Keyboard",icon:G0,searchable:!0,placeholder:"Filter shortcuts…",order:14},{id:"workspace",label:"Workspace",icon:T0,searchable:!1,order:15},{id:"environment",label:"Environment",icon:U0,searchable:!0,placeholder:"Filter environment…",order:16},{id:"providers",label:"Providers",icon:H0,searchable:!1,order:20},{id:"models",label:"Models",icon:L0,searchable:!0,placeholder:"Filter models…",order:30},{id:"theme",label:"Appearance",icon:N0,searchable:!1,order:40},{id:"scheduled-tasks",label:"Scheduled Tasks",icon:V0,searchable:!0,placeholder:"Filter scheduled tasks…",order:65},{id:"quick-actions",label:"Quick Actions",icon:X0,searchable:!0,placeholder:"Filter quick actions…",order:70},{id:"keychain",label:"Keychain",icon:Q0,searchable:!0,placeholder:"Filter entries…",order:75},{id:"tools",label:"Tools",icon:P0,searchable:!0,placeholder:"Filter tools…",order:80},{id:"addons",label:"Add-ons",icon:A0,searchable:!0,placeholder:"Filter add-ons…",order:90}]});m();ou();nr();var Z0=l`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`;function I0({label:n,body:r,filter:i=""}){return l`
    <div class="settings-section">
      <h3>${n}</h3>
      <p class="settings-hint">Mock add-on pane rendered by the settings widget fixture.</p>
      <div class="settings-addon-grid">
        ${["Credentials","Routes","Runtime options"].filter((_)=>!i||_.toLowerCase().includes(String(i).toLowerCase())).map((_)=>l`
          <div class="settings-addon-card">
            <div class="settings-addon-card-header">
              <div>
                <div class="settings-addon-name">${_}</div>
                <div class="settings-addon-subtitle">${r}</div>
              </div>
              <span class="settings-addon-enabled">fixture</span>
            </div>
            <div class="settings-row settings-row-vertical">
              <label>Mock field</label>
              <input type="text" value=${`${n.toLowerCase().replace(/\s+/g,"-")}:${_.toLowerCase().replace(/\s+/g,"-")}`} readonly />
            </div>
          </div>
        `)}
      </div>
    </div>
  `}function Y0(){let n=[{id:"fixture-z-observability",label:"Observability",body:"Latency, traces, and metrics."},{id:"fixture-a-portainer",label:"Portainer",body:"Container endpoint settings."},{id:"fixture-m-proxmox",label:"Proxmox",body:"Cluster profile and token settings."},{id:"fixture-b-cheapskate",label:"Cheapskate",body:"Model cost controls."}];for(let r of n)Mn({id:r.id,label:r.label,icon:Z0,searchable:!0,searchPlaceholder:`Filter ${r.label} settings…`,order:r.id==="fixture-z-observability"?1:999,component:(i)=>l`<${I0} label=${r.label} body=${r.body} filter=${i?.filter||""} />`})}var hn={userName:"Rui Carmo",assistantName:"Smith",userAvatar:"",assistantAvatar:"",composeUploadLimitMb:32,workspaceUploadLimitMb:256,widgetToken:"piclaw_widget_fixture_token_0123456789abcdef",searchMatchMode:"or",instanceTotp:{configured:!0,issuer:"Piclaw Fixture",label:"Piclaw Fixture:Rui Carmo",secret:"JBSWY3DPEHPK3PXP",otpauth:"otpauth://totp/Piclaw%20Fixture:Rui%20Carmo?secret=JBSWY3DPEHPK3PXP&issuer=Piclaw%20Fixture",qrSvg:'<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><rect width="96" height="96" rx="10" fill="#fff"/><g fill="#111"><rect x="10" y="10" width="22" height="22"/><rect x="64" y="10" width="22" height="22"/><rect x="10" y="64" width="22" height="22"/><rect x="40" y="14" width="8" height="8"/><rect x="52" y="26" width="8" height="8"/><rect x="42" y="42" width="10" height="10"/><rect x="62" y="46" width="8" height="8"/><rect x="76" y="60" width="8" height="8"/><rect x="48" y="72" width="8" height="8"/></g></svg>'},providers:[{id:"openai",label:"OpenAI",authType:"api_key",configured:!0},{id:"anthropic",label:"Anthropic",authType:"api_key",configured:!1},{id:"github-copilot",label:"GitHub Copilot",authType:"oauth",configured:!0}],models:["openai/gpt-5.1","anthropic/claude-sonnet-4-5","github-copilot/gpt-5.4-mini"],model_options:[{label:"openai/gpt-5.1",provider:"openai",name:"GPT-5.1",context_window:200000,reasoning:!0},{label:"anthropic/claude-sonnet-4-5",provider:"anthropic",name:"Claude Sonnet 4.5",context_window:200000,reasoning:!0},{label:"github-copilot/gpt-5.4-mini",provider:"github-copilot",name:"GPT-5.4 mini",context_window:128000,reasoning:!1}],current:"openai/gpt-5.1",thinking_level:"medium",supports_thinking:!0,available_thinking_levels:["off","minimal","low","medium","high"],themes:[{id:"system",label:"System",dark:!1},{id:"ipad-pro",label:"iPad Pro",dark:!0},{id:"terminal",label:"Terminal",dark:!0}],colorKeys:["accent","background","surface","text"],toolsets:[{name:"core",description:"Core shell and file tools",tools:[{name:"read",kind:"read-only"},{name:"bash",kind:"mutating"}]},{name:"ui",description:"Web UI posting tools",tools:[{name:"send_dashboard_widget",kind:"mutating"},{name:"send_adaptive_card",kind:"mutating"}]},{name:"remote",description:"Infrastructure tools",tools:[{name:"ssh",kind:"mixed"},{name:"proxmox",kind:"mixed"},{name:"portainer",kind:"mixed"}]}]},C0={current:hn.current,models:hn.models,model_options:hn.model_options,thinking_level:hn.thinking_level,supports_thinking:hn.supports_thinking,available_thinking_levels:hn.available_thinking_levels},su={sources:["fixture-catalog"],failed_sources:[],addons:[{slug:"cheapskate",name:"Cheapskate",description:"Model cost controls and routing hints.",installed:!0,enabled:!0,version:"0.1.0",bundled:!1},{slug:"observability",name:"Observability",description:"Local metrics and tracing panels.",installed:!0,enabled:!0,version:"0.2.0",bundled:!1},{slug:"portainer",name:"Portainer",description:"Container management add-on.",installed:!1,enabled:!1,version:"0.3.0",bundled:!1},{slug:"proxmox",name:"Proxmox",description:"Proxmox inventory and workflow add-on.",installed:!0,enabled:!1,version:"0.4.0",bundled:!1}]},gu={entries:[{name:"github/piclaw-bot-pat",type:"token",envVar:"GITHUB_PICLAW_BOT_PAT",updatedAt:new Date().toISOString(),userNote:"Fixture note",agentNote:"Use only through env injection."},{name:"ssh/relay.local",type:"secret",envVar:"SSH_RELAY_LOCAL",updatedAt:new Date().toISOString(),userNote:"",agentNote:""}]},Sn=new URLSearchParams(window.location.search).get("real")!=="1",$u=window.fetch.bind(window);function tn(n,r=200){return new Response(JSON.stringify(n),{status:r,headers:{"Content-Type":"application/json"}})}function O0(){window.fetch=async(n,r)=>{let i=new URL(typeof n==="string"?n:n.url,window.location.href),_=String(r?.method||"GET").toUpperCase();if(!Sn)return $u(n,r);if(i.pathname==="/agent/settings-data")return tn(hn);if(i.pathname==="/agent/models")return tn(C0);if(i.pathname==="/agent/addons")return tn(su);if(i.pathname.startsWith("/agent/addons/"))return tn({ok:!0,message:"Fixture add-on action accepted.",...su});if(i.pathname==="/agent/keychain"){if(_==="GET")return tn(gu);if(_==="POST")return tn({ok:!0,...gu})}if(i.pathname==="/agent/settings/general")return tn({ok:!0,settings:hn});if(i.pathname==="/agent/settings/widget-token/regenerate")return tn({ok:!0,settings:{...hn,widgetToken:`piclaw_widget_fixture_regenerated_${Date.now()}`}});if(i.pathname.startsWith("/agent/default/message"))return tn({command:{status:"success",message:"Fixture command accepted."}});if(i.pathname.startsWith("/agent/settings/"))return tn({ok:!0,settings:hn,items:[],entries:[]});if(i.pathname==="/agent/client-perf")return tn({ok:!0});return $u(n,r)}}function J0(){let n=document.createElement("style");n.textContent=`
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
  `,document.head.appendChild(n)}function wu(n){try{window.__piclawSettingsRequestedSection=n}catch(r){}window.dispatchEvent(new CustomEvent("piclaw:open-settings",{detail:{section:n}}))}function E0(){let n=new URLSearchParams(window.location.search),[r,i]=w(n.get("section")||"general"),[_,c]=w(Number(n.get("width")||900)),[u,f]=w(Number(n.get("height")||640)),[o,s]=w(Sn),[$,p]=w(0),g=D(()=>["general","sessions","compaction","keyboard","workspace","environment","providers","models","theme","scheduled-tasks","quick-actions","keychain","tools","addons","fixture-b-cheapskate","fixture-z-observability","fixture-a-portainer","fixture-m-proxmox"],[]),b=T((v)=>{i(v),wu(v)},[]),x=T(()=>{Sn=!Sn,s(Sn),p((v)=>v+1)},[]);return l`
    <div class="settings-fixture-shell">
      <div class="settings-fixture-toolbar">
        <strong>Settings fixture</strong>
        <label>Section <select value=${r} onChange=${(v)=>b(v.target.value)}>${g.map((v)=>l`<option value=${v}>${v}</option>`)}</select></label>
        <label>Width <input type="range" min="480" max="1200" value=${_} onInput=${(v)=>c(Number(v.target.value))} /> ${_}px</label>
        <label>Height <input type="range" min="420" max="900" value=${u} onInput=${(v)=>f(Number(v.target.value))} /> ${u}px</label>
        <button type="button" onClick=${x}>${o?"Mock data":"Real endpoints"}</button>
        <button type="button" onClick=${()=>p((v)=>v+1)}>Remount</button>
        <span class="settings-fixture-note">Add-on panes are registered in scrambled order for nav ordering tests.</span>
      </div>
      <div class="settings-fixture-canvas" style=${`--fixture-width:${_}px;--fixture-height:${u}px;`}>
        <${Zr} key=${$} onClose=${()=>{}} />
      </div>
    </div>
  `}function d0(){Y0(),O0(),J0();let n=new URLSearchParams(window.location.search);wu(n.get("section")||"general");let r=document.getElementById("settings-widget-fixture-root")||document.body.appendChild(document.createElement("div"));r.id="settings-widget-fixture-root",Qn(l`<${E0} />`,r),window.piclawWidget?.ready?.({title:"Settings fixture",mockMode:Sn})}d0();

//# debugId=79F830210695736864756E2164756E21
//# sourceMappingURL=settings-widget-fixture.bundle.js.map
