precision highp float;
uniform sampler2D tex;
 
void main()
{
    vec4 color = texture2D(tex,gl_FragCoord.xy);
    gl_FragColor = color;
}